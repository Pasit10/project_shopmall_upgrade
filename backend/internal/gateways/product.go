package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (h HTTPGateway) GetAllProduct(c *fiber.Ctx) error {
	product, err := h.ProductService.GetAllProduct()
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(product)
}

func (h HTTPGateway) GetAllProductType(c *fiber.Ctx) error {
	productType, err := h.ProductService.GetAllProductType()
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(productType)
}

func (h HTTPGateway) GetProductByProductTypeID(c *fiber.Ctx) error {
	urlparams := c.Params("type_id")

	typeid, err := strconv.Atoi(urlparams)

	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	product, err := h.ProductService.GetProductByProductTypeID(typeid)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(product)
}

func (h HTTPGateway) CreateProduct(c *fiber.Ctx) error {
	// check role
	if role := c.Locals("role").(string); !(role == "admin" || role == "super admin") {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.UnauthorizedError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	var data entities.Product
	if err := c.BodyParser(&data); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	err := h.ProductService.CreateProduct(data)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "suceess"})
}

// func (h HTTPGateway) UpdateProduct(c *fiber.Ctx) error {

// }

// func (h HTTPGateway) DeleteProduct(c *fiber.Ctx) error {

// }
