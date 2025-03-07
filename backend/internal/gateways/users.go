package gateways

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func (h HTTPGateway) TestService(c *fiber.Ctx) error {
	user := c.Locals("name")
	res := fmt.Sprintf("Hello! %s", user)
	return c.JSON(fiber.Map{"message": res})
}

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
