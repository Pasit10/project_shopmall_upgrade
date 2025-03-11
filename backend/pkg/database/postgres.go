package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgresDatabaseConnection() *gorm.DB {
	ConnectionMasterDB := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("POSTGRES_DATABASE_HOST"),
		os.Getenv("POSTGRES_DATABASE_PORT"),
		os.Getenv("POSTGRES_DATABASE_USER"),
		os.Getenv("POSTGRES_DATABASE_PASSWORD"),
		os.Getenv("POSTGRES_DATABASE_NAME"),
	)

	db, err := gorm.Open(postgres.Open(ConnectionMasterDB), &gorm.Config{})
	if err != nil {
		log.Fatalf("[Database] Failed to connect to database: %s", err.Error())
	}

	return db
}
