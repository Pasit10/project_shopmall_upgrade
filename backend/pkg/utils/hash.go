package utils

import (
	"fmt"
	"log"
	"runtime"

	"github.com/alexedwards/argon2id"
)

var configParams = &argon2id.Params{
	Memory: 64 * 1024,
	// The amount of memory used by the algorithm (in kibibytes).
	Iterations: 5,
	// The number of iterations over the memory.
	Parallelism: uint8(runtime.NumCPU()),
	// The number of threads (or lanes) used by the algorithm. Recommended value is between 1 and runtime.NumCPU().
	SaltLength: 16,
	// Length of the random salt. 16 bytes is recommended for password hashing.
	KeyLength: 32,
	// Length of the generated key. 16 bytes or more is recommended.
}

// HashPassword generates a hashed password using argon2id
func HashPassword(password string) (string, error) {
	hash, err := argon2id.CreateHash(password, configParams)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return hash, nil
}

// VerifyPassword checks if the given password matches the hashed password
func VerifyPassword(password, hashedPassword string) (bool, error) {
	match, err := argon2id.ComparePasswordAndHash(password, hashedPassword)
	if err != nil {
		log.Printf("error verifying password: %v", err)
		return false, err
	}
	return match, nil
}
