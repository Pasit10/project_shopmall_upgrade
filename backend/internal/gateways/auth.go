package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/middlewares"
	"sync"
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

	access_token, err := middlewares.GenerateAccessJWT(user.UID, user.Email, user.Name, user.Role)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	refreshToken, err := middlewares.GenerateRefreshToken(user.UID)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	cookie := generateCookie("access-token", access_token, time.Now().Add(1*time.Hour))
	refreshCookie := generateCookie("refresh-token", refreshToken, time.Now().Add(7*time.Hour))
	c.Cookie(cookie)
	c.Cookie(refreshCookie)

	return c.JSON(fiber.Map{"message": "Login successful", "role": user.Role})
}

func (h HTTPGateway) Register(c *fiber.Ctx) error {
	var req entities.UserAuth
	req.UID = uuid.New().String()
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}
	req.Role = "user"
	req.Logintype = "local"
	err := h.AuthService.Register(req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	access_token, err := middlewares.GenerateAccessJWT(req.UID, req.Email, req.Name, req.Role)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	refreshToken, err := middlewares.GenerateRefreshToken(req.UID)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	cookie := generateCookie("access-token", access_token, time.Now().Add(1*time.Hour))
	refreshCookie := generateCookie("refresh-token", refreshToken, time.Now().Add(7*time.Hour))
	c.Cookie(cookie)
	c.Cookie(refreshCookie)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Register Success"})
}

func (h HTTPGateway) LoginWithGoogle(c *fiber.Ctx) error {
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

	user, err := h.AuthService.LoginWithGoogle(uid, req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	access_token, err := middlewares.GenerateAccessJWT(user.UID, user.Email, user.Name, user.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	refreshToken, err := middlewares.GenerateRefreshToken(user.UID) // Implement this function
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	cookie := generateCookie("access-token", access_token, time.Now().Add(1*time.Hour))
	refreshCookie := generateCookie("refresh-token", refreshToken, time.Now().Add(7*time.Hour))
	c.Cookie(cookie)
	c.Cookie(refreshCookie)
	return c.JSON(fiber.Map{"message": "Login successful", "role": user.Role})
}

func (h HTTPGateway) GetNewAccessToken(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	user, err := h.AuthService.GetUserByUID(uid)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	access_token, err := middlewares.GenerateAccessJWT(user.UID, user.Email, user.Name, user.Role)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	refreshToken, err := middlewares.GenerateRefreshToken(user.UID) // Implement this function
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	cookie := generateCookie("access-token", access_token, time.Now().Add(1*time.Hour))
	refreshCookie := generateCookie("refresh-token", refreshToken, time.Now().Add(7*time.Hour))
	c.Cookie(cookie)
	c.Cookie(refreshCookie)
	return c.JSON(fiber.Map{"message": "refresh successful"})
}

// Logout function to blacklist JWT
func (h HTTPGateway) Logout(c *fiber.Ctx) error {
	accessJWT := c.Cookies("access-token")
	refreshJWT := c.Cookies("refresh-token")

	var wg sync.WaitGroup
	var err1, err2 error
	wg.Add(2)

	go func() {
		defer wg.Done()
		parsedAccessToken, err := middlewares.ParseAccessJWT(accessJWT)
		if err != nil || !parsedAccessToken.Valid {
			err1 = templateError.MissingOrMalformedToken
		}
		claims, ok := parsedAccessToken.Claims.(jwt.MapClaims)
		if !ok || claims["exp"] == nil {
			err1 = templateError.MissingOrMalformedToken
		}
		expirationTime := int64(claims["exp"].(float64))
		err = middlewares.BlacklistToken(accessJWT, expirationTime)
		if err != nil {
			err1 = templateError.MissingOrMalformedToken
		}
	}()

	go func() {
		defer wg.Done()
		paresdRefreshToken, err := middlewares.ParseRefreshJWT(refreshJWT)
		if err != nil || !paresdRefreshToken.Valid {
			err2 = templateError.MissingOrMalformedToken
		}
		claims, ok := paresdRefreshToken.Claims.(jwt.MapClaims)
		if !ok || claims["exp"] == nil {
			err2 = templateError.MissingOrMalformedToken
		}
		expirationTime := int64(claims["exp"].(float64))
		err = middlewares.BlacklistToken(refreshJWT, expirationTime)
		if err != nil {
			err2 = templateError.MissingOrMalformedToken
		}
	}()

	wg.Wait()

	if err1 != nil || err2 != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	c.Cookie(&fiber.Cookie{
		Name:     "access-token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HTTPOnly: true,
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh-token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HTTPOnly: true,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

func generateCookie(name string, value string, exp time.Time) *fiber.Cookie {
	cookie := &fiber.Cookie{
		Name:     name,
		Value:    value,
		Expires:  exp,
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false, // Use true if on HTTPS
	}
	return cookie
}
