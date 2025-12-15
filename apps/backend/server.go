package main

import (
	"log"

	"myapp/internal/config"
	"myapp/internal/livekit"
	"myapp/internal/router"
	"myapp/internal/storage"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize LiveKit client
	client := livekit.NewClient(cfg)

	// Initialize R2 client (optional - only if configured)
	var r2 *storage.R2Client
	if cfg.R2Endpoint != "" && cfg.R2AccessKeyID != "" {
		var err error
		r2, err = storage.NewR2Client(cfg)
		if err != nil {
			log.Printf("Warning: Failed to initialize R2 client: %v", err)
		} else {
			log.Println("R2 storage client initialized")
		}
	}

	// Create Echo instance
	e := echo.New()

	// Setup routes
	router.Setup(e, client, r2, cfg)

	// Start server
	e.Logger.Fatal(e.Start(cfg.Port))
}
