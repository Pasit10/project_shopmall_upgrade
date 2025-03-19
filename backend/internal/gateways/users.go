package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"

	"github.com/gofiber/fiber/v2"
)

func (h HTTPGateway) GetUser(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	user, err := h.UserService.GetuserData(uid)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(user)
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
