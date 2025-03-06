package gateways

import (
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

type HTTPGateway struct {
	AuthService    services.IAuthService
	ProductService services.IProductRepository
}

func InitHTTPGateway(app *fiber.App, auth services.IAuthService, product services.IProductRepository) {
	gateway := &HTTPGateway{
		AuthService:    auth,
		ProductService: product,
	}

	InitRoutes(app, *gateway)
}
