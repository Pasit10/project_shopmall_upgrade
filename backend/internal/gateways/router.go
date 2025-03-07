package gateways

import (
	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(app *fiber.App, gateways HTTPGateway) {

	// Public Routes
	app.Post("/login", gateways.Login)
	app.Post("/register", gateways.Register)
	app.Get("/logout", gateways.Logout)

	// use Google middleware only login with google
	google := app.Group("/google", middlewares.SetverifyGoogleTokenMiddleware)
	google.Post("/login", gateways.LoginWithGoogle)
	google.Post("/register", gateways.RegisterWithGoogle)

	// User
	users := app.Group("/user", middlewares.SetJWTHandler())
	users.Get("/", gateways.TestService)
	users.Get("/me", gateways.GetUser)

	productNojwt := app.Group("/product")
	productNojwt.Get("/", gateways.GetAllProduct)
	productNojwt.Get("/type", gateways.GetAllProductType)
	productNojwt.Get("/type/:type_id", gateways.GetProductByProductTypeID)
}
