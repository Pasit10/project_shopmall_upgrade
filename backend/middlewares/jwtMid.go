package middlewares

import (
	templateError "backend/error"
	redisdb "backend/pkg/database"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

var jwtSecret = []byte(os.Getenv("SECRET_KEY"))

func SetJWTHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenStr := c.Cookies("jwt-token")
		if tokenStr == "" {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		// Check if the token is blacklisted in Redis
		isBlacklisted, err := IsTokenBlacklisted(tokenStr)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
		if isBlacklisted {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.InvalidOrExpiredToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		token, err := ParseJWT(tokenStr)
		if err != nil || !token.Valid {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.InvalidOrExpiredToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Locals("uid", claims["uid"])
		c.Locals("email", claims["email"])
		c.Locals("name", claims["name"])
		c.Locals("role", claims["role"])

		return c.Next()
	}
}

func GenerateJWT(uid string, email string, name string, role string) (string, error) {
	expirationTime := time.Now().Add(time.Hour * 24)
	claims := jwt.MapClaims{
		"uid":   uid,
		"email": email,
		"name":  name,
		"role":  role,
		"exp":   expirationTime.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseJWT(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
}

// BlacklistToken adds a JWT to Redis blacklist with expiration
func BlacklistToken(tokenStr string, exp int64) error {
	ttl := time.Until(time.Unix(exp, 0)) // Calculate TTL based on expiration time
	if ttl <= 0 {
		ttl = time.Minute * 5 // Default TTL if token is already expired
	}
	return redisdb.Client.Set(redisdb.Ctx, tokenStr, "blacklisted", ttl).Err()
}

// IsTokenBlacklisted checks if a JWT is blacklisted in Redis
func IsTokenBlacklisted(tokenStr string) (bool, error) {
	result, err := redisdb.Client.Get(redisdb.Ctx, tokenStr).Result()
	if err == redis.Nil {
		return false, nil // Token is not blacklisted
	} else if err != nil {
		return false, err // Redis error
	}
	return result == "blacklisted", nil
}
