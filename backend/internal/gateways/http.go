package gateways

import (
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

type HTTPGateway struct {
	AuthService    services.IAuthService
	ProductService services.IProductService
	UserService    services.IUserService
	AdminService   services.IAdminService
}

func InitHTTPGateway(app *fiber.App, auth services.IAuthService, product services.IProductService, user services.IUserService, admin services.IAdminService) {
	gateway := &HTTPGateway{
		AuthService:    auth,
		ProductService: product,
		UserService:    user,
		AdminService:   admin,
	}

	AuthRoutes(app, *gateway)
	UsersRoutes(app, *gateway)
	ProductRoutes(app, *gateway)
	AdminRoutes(app, *gateway)
}
