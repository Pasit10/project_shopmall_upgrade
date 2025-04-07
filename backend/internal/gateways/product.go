package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"fmt"
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

func (h HTTPGateway) GetProductByID(c *fiber.Ctx) error {
	urlparams := c.Params("product_id")

	productid, err := strconv.Atoi(urlparams)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	product, err := h.ProductService.GetProductByID(productid)
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

func (h HTTPGateway) GetProductFilter(c *fiber.Ctx) error {
	// (typeid int, minprice float64, maxprice float64)
	typeid_str := c.Query("typeid")
	minprice_str := c.Query("minprice")
	maxprice_str := c.Query("maxprice")

	typeid, err := strconv.Atoi(typeid_str)
	if err != nil {
		fmt.Println("1")
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	minprice, err := strconv.ParseFloat(minprice_str, 64)
	if err != nil {
		fmt.Println("2")
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	maxprice, err := strconv.ParseFloat(maxprice_str, 64)
	if err != nil {
		fmt.Println("3")
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	productfilter, err := h.ProductService.GetProductFilter(typeid, minprice, maxprice)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(productfilter)
}

func (h HTTPGateway) CreateProduct(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
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

func (h HTTPGateway) UpdateProduct(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	product_id_str := c.Params("product_id")
	product_id, err := strconv.Atoi(product_id_str)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	var newproduct entities.Product
	if err := c.BodyParser(&newproduct); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	err = h.ProductService.UpdateProduct(product_id, newproduct)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{"message": "suceess"})
}

func (h HTTPGateway) DeleteProduct(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	product_id_str := c.Params("product_id")
	product_id, err := strconv.Atoi(product_id_str)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	err = h.ProductService.DeleteProduct(product_id)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{"message": "suceess"})
}

func (h HTTPGateway) UpdateQtyProduct(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	product_id_str := c.Params("product_id")
	product_id, err := strconv.Atoi(product_id_str)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	var newqty entities.UpdateQtyProduct
	if err := c.BodyParser(&newqty); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	err = h.ProductService.UpdateQtyProduct(product_id, newqty.Qty)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{"message": "suceess"})
}
