package gateways

import (
	templateError "backend/error"
	"backend/internal/entities"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (h HTTPGateway) GetAllTransaction(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	tranx, err := h.AdminService.GetAllTransaction()
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(tranx)
}

func (h HTTPGateway) UpdateStatusTransaction(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	transactionId_str := c.Query("tranxId")
	transactionId, err := strconv.Atoi(transactionId_str)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}

	status_str := c.Query("statusID")
	status, err := strconv.Atoi(status_str)
	if err != nil {
		httpStatusCode, errorresponse := templateError.GetErrorResponse(templateError.BadrequestError)
		return c.Status(httpStatusCode).JSON(errorresponse)
	}
	err = h.AdminService.UpdateStatusTransaction(uid, transactionId, status)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	return c.JSON(fiber.Map{
		"message": "Status updated successfully",
	})
}

func (h HTTPGateway) GetAllAdmin(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionSuperAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	admins, err := h.AdminService.GetAllAdmin()
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(admins)
}

func (h HTTPGateway) CrateAdmin(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionSuperAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	var admin entities.CreateAdmin
	if err := c.BodyParser(&admin); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	err := h.AdminService.CreateAdmin(admin)
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(fiber.Map{
		"message": "Admin created successfully",
	})
}

func (h HTTPGateway) GetAllTransactionLog(c *fiber.Ctx) error {
	// check role
	uid := c.Locals("uid").(string)
	if err := h.AuthService.CheckPermissionSuperAdmin(uid); err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}

	transactionlog, err := h.AdminService.GetAllTransactionLog()
	if err != nil {
		httpstatuscode, errorresponse := templateError.GetErrorResponse(err)
		return c.Status(httpstatuscode).JSON(errorresponse)
	}
	return c.JSON(transactionlog)
}
