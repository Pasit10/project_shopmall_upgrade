package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/middlewares"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func (h HTTPGateway) Login(c *fiber.Ctx) error {
	var req entities.UserLogin
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	isValid, user, err := h.AuthService.Login(req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	if !isValid {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(templateError.UnauthorizedError)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	token, err := middlewares.GenerateJWT(user.UID, user.Email, user.Name, user.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	c.Cookie(&fiber.Cookie{
		Name:     "jwt-token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false, // Use true if on HTTPS
	})
	return c.JSON(fiber.Map{"message": "Login successful"})
}

func (h HTTPGateway) Register(c *fiber.Ctx) error {
	var req entities.UserAuth
	req.UID = uuid.New().String()
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}
	req.Role = "user"
	err := h.AuthService.Register(req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	token, err := middlewares.GenerateJWT(req.UID, req.Email, req.Name, req.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	c.Cookie(&fiber.Cookie{
		Name:     "jwt-token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false,
	})
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created"})
}

// Logout function to blacklist JWT
func (h HTTPGateway) Logout(c *fiber.Ctx) error {
	fmt.Println("tiit")
	tokenStr := c.Cookies("jwt-token")
	if tokenStr == "" {
		httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
		return c.Status(httpstatuscode).JSON(errorResponse)
	}

	// Parse the JWT to extract expiration time
	token, err := middlewares.ParseJWT(tokenStr)
	if err != nil || !token.Valid {
		httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.InvalidOrExpiredToken)
		return c.Status(httpstatuscode).JSON(errorResponse)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["exp"] == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid token structure",
		})
	}

	expirationTime := int64(claims["exp"].(float64))

	// Blacklist the token
	err = middlewares.BlacklistToken(tokenStr, expirationTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to blacklist token",
		})
	}

	// Remove the JWT from cookies
	c.Cookie(&fiber.Cookie{
		Name:     "jwt-token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HTTPOnly: true,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}
func (h HTTPGateway) RegisterWithGoogle(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)
	email := c.Locals("email").(string)
	name := c.Locals("name").(string)
	picture := c.Locals("picture").(string)

	var req = entities.UserAuth{
		UID:     uid,
		Email:   email,
		Name:    name,
		Picture: picture,
		Role:    "user",
	}
	req.Role = "user"
	err := h.AuthService.RegisterGoogle(req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	token, err := middlewares.GenerateJWT(req.UID, req.Email, req.Name, req.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	c.Cookie(&fiber.Cookie{
		Name:     "jwt-token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false,
	})
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created"})
}

func (h HTTPGateway) LoginWithGoogle(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)
	user, err := h.AuthService.GetUserByUID(uid)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	token, err := middlewares.GenerateJWT(user.UID, user.Email, user.Name, user.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	c.Cookie(&fiber.Cookie{
		Name:     "jwt-token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false, // Use true if on HTTPS
	})
	return c.JSON(fiber.Map{"message": "Login successful"})
}
