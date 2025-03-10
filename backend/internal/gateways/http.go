package gateways

import (
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

type HTTPGateway struct {
	AuthService    services.IAuthService
	ProductService services.IProductService
}

func InitHTTPGateway(app *fiber.App, auth services.IAuthService, product services.IProductService) {
	gateway := &HTTPGateway{
		AuthService:    auth,
		ProductService: product,
	}

	AuthRoutes(app, *gateway)
	UsersRoutes(app, *gateway)
	ProductRoutes(app, *gateway)
}
