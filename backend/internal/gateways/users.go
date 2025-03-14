package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"

	"github.com/gofiber/fiber/v2"
)

// ยังไม่แก้
func (h HTTPGateway) GetUser(c *fiber.Ctx) error {
	email := c.Locals("email")
	name := c.Locals("name")
	role := c.Locals("role")
	return c.JSON(fiber.Map{
		"email": email,
		"name":  name,
		"role":  role,
	})
}

func (h HTTPGateway) InsertCart(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	var data entities.InsertCart
	if err := c.BodyParser(&data); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	if err := h.UserService.InsertCart(uid, data); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{"message": "success"})
}

func (h HTTPGateway) GetCartByUID(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	cart, err := h.UserService.GetCartByUID(uid)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(cart)
}
