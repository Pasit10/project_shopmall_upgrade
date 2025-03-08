package database

import (
	"context"
	"os"

	"github.com/redis/go-redis/v9"
)

// Global Redis client instance
var Client *redis.Client
var Ctx = context.Background()

// Initialize Redis connection
func InitRedis() {
	Client = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"), // Change if running on a different host/port
		Password: os.Getenv("REDIS_PASS"), // Set if Redis has a password
		DB:       0,                       // Use default DB
	})
}

// Close Redis connection
func CloseRedis() {
	if Client != nil {
		Client.Close()
	}
}
