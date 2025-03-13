package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/middlewares"
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

	err := h.AuthService.RegisterGoogle(req)
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	access_token, err := middlewares.GenerateAccessJWT(req.UID, req.Email, req.Name, req.Role) ///TODO: change role
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}
	refreshToken, err := middlewares.GenerateRefreshToken(req.UID) // Implement this function
	if err != nil {
		httpStatusCode, errorResponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorResponse)
	}

	cookie := generateCookie("access-token", access_token, time.Now().Add(1*time.Hour))
	refreshCookie := generateCookie("refresh-token", refreshToken, time.Now().Add(7*time.Hour))
	c.Cookie(cookie)
	c.Cookie(refreshCookie)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created"})
}

func (h HTTPGateway) LoginWithGoogle(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)
	user, err := h.AuthService.GetUserByUID(uid)
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
	if accessJWT == "" || refreshJWT == "" {
		httpstatuscode, errorResponse := templateError.GetErrorResponse(templateError.MissingOrMalformedToken)
		return c.Status(httpstatuscode).JSON(errorResponse)
	}

	// ตรวจสอบและเพิ่ม token ลง blacklist
	if err := validateAndBlacklistToken(accessJWT); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if err := validateAndBlacklistToken(refreshJWT); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
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

func validateAndBlacklistToken(token string) error {
	parsedToken, err := middlewares.ParseAccessJWT(token)
	if err != nil || !parsedToken.Valid {
		return templateError.MissingOrMalformedToken
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || claims["exp"] == nil {
		return templateError.MissingOrMalformedToken
	}

	expirationTime := int64(claims["exp"].(float64))
	return middlewares.BlacklistToken(token, expirationTime)
}
