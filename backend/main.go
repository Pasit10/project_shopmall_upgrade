package main

import (
	"backend/configuration"
	"backend/internal/gateways"
	repo "backend/internal/repositories"
	ser "backend/internal/services"
	"backend/middlewares"
	"backend/pkg/database"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("err load ENV")
		os.Exit(1)
	}

	app := fiber.New(configuration.NewConfiguraiton())
	app.Use(middlewares.NewLogger())
	// app.Use(cors.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000, http://localhost:5173, http://localhost:8080",
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

	authService := ser.InitAuthenService(authRepo)
	produteService := ser.InitProductService(productRepo)
	usersService := ser.InitUsersService(usersRepo, productRepo, cartRepo)

	gateways.InitHTTPGateway(app, authService, produteService, usersService)

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
