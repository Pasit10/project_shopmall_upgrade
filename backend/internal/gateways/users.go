package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"encoding/json"
	"strconv"

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

func (h HTTPGateway) UpdateCartManyByUID(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	var requestData entities.UpdateCart

	if err := json.Unmarshal(c.Body(), &requestData); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	if err := h.UserService.UpdateCartManyByUID(uid, requestData.Cart); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{"message": "success"})
}

func (h HTTPGateway) DeleteCartByUID(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	idproduct_str := c.Params("product_id")
	idproduct, err := strconv.Atoi(idproduct_str)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	if err := h.UserService.DeleteCartByUID(uid, idproduct); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	return c.JSON(fiber.Map{"message": "success"})
}

func (h HTTPGateway) CreateTransaction(c *fiber.Ctx) error {
	uid := c.Locals("uid").(string)

	if err := h.UserService.CreateTransaction(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "success"})
}
