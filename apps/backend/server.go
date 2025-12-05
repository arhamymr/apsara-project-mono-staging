package main

import (
	"myapp/internal/config"
	"myapp/internal/livekit"
	"myapp/internal/router"

	"github.com/labstack/echo/v4"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize LiveKit client
	client := livekit.NewClient(cfg)

	// Create Echo instance
	e := echo.New()

	// Setup routes
	router.Setup(e, client)

	// Start server
	e.Logger.Fatal(e.Start(cfg.Port))
}
