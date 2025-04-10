package main

import (
	"backend/configuration"
	"backend/internal/gateways"
	repo "backend/internal/repositories"
	ser "backend/internal/services"
	"backend/middlewares"
	"backend/pkg/database"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// ----- remove before deploy ------ //
	// err := godotenv.Load(".env.test")
	// if err != nil {
	// 	fmt.Println("err load ENV")
	// 	os.Exit(1)
	// }
	// --------------------------------- //

	app := fiber.New(configuration.NewConfiguraiton())
	app.Use(middlewares.NewLogger())
	// app.Use(cors.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000, http://localhost:5173, http://localhost, https://modernofurniture.xyz/",
		AllowCredentials: true,
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowHeaders:     "Content-Type, Authorization",
	}))
	// app.Use(swagger.New(swagger.Config{
	// 	BasePath: "/",
	// 	FilePath: "./docs/swagger.yaml",
	// 	Path:     "docs",
	// }))

	// SetUp Database
	mysql := database.InitDatabaseConnection()
	// postgres := database.InitPostgresDatabaseConnection()

	// setup redis
	database.InitRedis()
	defer database.CloseRedis()

	authRepo := repo.InitAuthRepository(mysql)
	productRepo := repo.InitProdcutRepository(mysql)
	usersRepo := repo.InitUsersRepository(mysql)
	cartRepo := repo.InitCartRepository(mysql)
	tranxRepo := repo.InitTransactionRepository(mysql)

	authService := ser.InitAuthenService(authRepo)
	produteService := ser.InitProductService(productRepo)
	usersService := ser.InitUsersService(usersRepo, productRepo, cartRepo, tranxRepo)
	adminService := ser.InitAdminService(tranxRepo, usersRepo)

	gateways.InitHTTPGateway(app, authService, produteService, usersService, adminService)

	PORT := os.Getenv("SERVER_PORT")
	if PORT == "" {
		PORT = "8080"
	}

	app.Listen(":" + PORT)
	// err = app.ListenTLS(":"+PORT, "server.crt", "server.key")
	// if err != nil {
	// 	log.Fatal(err)
	// }
}
