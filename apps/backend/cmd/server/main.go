package main

import (
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	// Middleware
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(middleware.CORS())

	// Health check
	e.GET("/", handlers.HealthCheck)

	// LiveKit routes
	lk := e.Group("/livekit")
	lk.POST("/token", handlers.GetToken)
	lk.POST("/rooms", handlers.CreateRoom)
	lk.GET("/rooms", handlers.ListRooms)
	lk.DELETE("/rooms/:room", handlers.DeleteRoom)
	lk.GET("/rooms/:room/participants", handlers.ListParticipants)
	lk.DELETE("/rooms/:room/participants/:identity", handlers.RemoveParticipant)
	lk.POST("/rooms/:room/participants/:identity/mute", handlers.MuteTrack)
	lk.POST("/webhook", handlers.Webhook)

	e.Logger.Fatal(e.Start(":1323"))
}
