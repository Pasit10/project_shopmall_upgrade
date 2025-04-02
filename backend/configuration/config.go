package configuration

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func NewConfiguraiton() fiber.Config {
	return fiber.Config{
		AppName:     "Furniture Shop ༼ つ ◕_◕ ༽つ ",
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
		// Prefork:     true,
	}
}
