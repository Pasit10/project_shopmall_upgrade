package gateways

import (
	templateError "backend/error"
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
