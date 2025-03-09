package middlewares

import (
	templateError "backend/error"
	redisdb "backend/pkg/database"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

var accessSecret = []byte(os.Getenv("ACCESS_SECRET_KEY"))
var refreshSecret = []byte(os.Getenv("REFRESH_SECRET_KEY"))

// splunk
func SetJWTHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		accessJWT := c.Cookies("access-token")
		refreshJWT := c.Cookies("refresh-token")

		if accessJWT == "" && refreshJWT == "" {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		// Check if the token is blacklisted in Redis
		isBlacklisted, err := IsTokenBlacklisted(accessJWT)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cannot Connect Redis Server Error",
			})
		}
		if isBlacklisted {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.InvalidOrExpiredToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		token, err := ParseAccessJWT(accessJWT)
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

func SetRefreshJWTHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		refreshJWT := c.Cookies("refresh-token")

		if refreshJWT == "" {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		token, err := ParseRefreshJWT(refreshJWT)
		if err != nil || !token.Valid {
			httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.InvalidOrExpiredToken)
			return c.Status(httpstatuscode).JSON(errorResponse)
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Locals("uid", claims["uid"])
		return c.Next()
	}
}

func GenerateAccessJWT(uid string, email string, name string, role string) (string, error) {
	expirationStr := os.Getenv("EXP_TIME_ACCESS_TOKEN")
	expirationTime, err := strconv.Atoi(expirationStr)
	if err != nil {
		return "", err
	}
	exp := time.Now().Add(time.Duration(expirationTime) * time.Second).Unix()
	claims := jwt.MapClaims{
		"uid":   uid,
		"email": email,
		"name":  name,
		"role":  role,
		"exp":   exp,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(accessSecret)
}

func GenerateRefreshToken(uid string) (string, error) {
	expirationStr := os.Getenv("EXP_TIME_ACCESS_TOKEN")
	expirationTime, err := strconv.Atoi(expirationStr)
	if err != nil {
		return "", err
	}
	exp := time.Now().Add(time.Duration(expirationTime) * time.Second).Unix()
	claims := jwt.MapClaims{
		"uid": uid,
		"exp": exp,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(refreshSecret)
}

func ParseAccessJWT(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return accessSecret, nil
	})
}

func ParseRefreshJWT(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return refreshSecret, nil
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
