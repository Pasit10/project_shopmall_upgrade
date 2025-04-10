package gateways

import (
	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, gateways HTTPGateway) {
	// Public Routes
	app.Post("/login", gateways.Login)
	app.Post("/register", gateways.Register)
	authJWT := app.Group("/auth", middlewares.SetJWTHandler())
	authJWT.Get("/logout", gateways.Logout)

	// Refresh JWT
	authRefresh := app.Group("/token", middlewares.SetRefreshJWTHandler())
	authRefresh.Get("/refresh", gateways.GetNewAccessToken)

	// use Google middleware only login with google
	google := app.Group("/google", middlewares.SetverifyGoogleTokenMiddleware)
	google.Post("/login", gateways.LoginWithGoogle) // login and register
}

func UsersRoutes(app *fiber.App, gateways HTTPGateway) {
	// User
	users := app.Group("/user", middlewares.SetJWTHandler())
	users.Get("/me", gateways.GetUser)
	users.Post("/cart", gateways.InsertCart)
	users.Get("/cart", gateways.GetCartByUID)
	users.Put("/cart", gateways.UpdateCartManyByUID)
	users.Delete("/cart/:product_id", gateways.DeleteCartByUID)
	users.Put("/update", gateways.UpdateUser)

	userstranx := app.Group("/user", middlewares.SetJWTHandler())
	userstranx.Get("/crate_transaction", gateways.CreateTransaction)
	userstranx.Get("/transaction", gateways.GetTransaction)
}

func ProductRoutes(app *fiber.App, gateways HTTPGateway) {
	// Product
	productNojwt := app.Group("/product")
	productNojwt.Get("/", gateways.GetAllProduct)
	productNojwt.Get("/type", gateways.GetAllProductType)
	productNojwt.Get("/type/:type_id", gateways.GetProductByProductTypeID)
	productNojwt.Get("/filter", gateways.GetProductFilter)
	productNojwt.Get("/:product_id", gateways.GetProductByID)

	productJWT := app.Group("/product", middlewares.SetJWTHandler())
	productJWT.Post("/", gateways.CreateProduct)
	productJWT.Put("/:product_id", gateways.UpdateProduct)
	productJWT.Delete("/:product_id", gateways.DeleteProduct)
	productJWT.Put("/qty/:product_id", gateways.UpdateQtyProduct)
}

func AdminRoutes(app *fiber.App, gateways HTTPGateway) {
	// Admin
	admin := app.Group("/admin", middlewares.SetJWTHandler())
	admin.Get("/transaction", gateways.GetAllTransaction)
	admin.Get("/", gateways.GetAllAdmin)
	admin.Post("/", gateways.CrateAdmin)
	admin.Get("/transaction_update", gateways.UpdateStatusTransaction)
	admin.Get("/transaction_log", gateways.GetAllTransactionLog)
}
