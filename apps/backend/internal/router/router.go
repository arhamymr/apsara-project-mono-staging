package router

import (
	"net/http"

	"myapp/internal/handler"
	"myapp/internal/livekit"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Setup(e *echo.Echo, client *livekit.Client) {
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	}))

	// Health check
	e.GET("/", handler.HealthCheck)

	// Swagger UI (single source from docs/swagger.json)
	e.GET("/docs", handler.SwaggerUIHandler)
	e.GET("/swagger.json", handler.SwaggerJSONHandler)

	// Initialize handlers
	tokenHandler := handler.NewTokenHandler(client)
	roomHandler := handler.NewRoomHandler(client)
	participantHandler := handler.NewParticipantHandler(client)
	webhookHandler := handler.NewWebhookHandler(client)

	// LiveKit routes
	lk := e.Group("/livekit")
	
	// Token
	lk.POST("/token", tokenHandler.GetToken)
	
	// Rooms
	lk.POST("/rooms", roomHandler.CreateRoom)
	lk.GET("/rooms", roomHandler.ListRooms)
	lk.DELETE("/rooms/:room", roomHandler.DeleteRoom)
	
	// Participants
	lk.GET("/rooms/:room/participants", participantHandler.ListParticipants)
	lk.DELETE("/rooms/:room/participants/:identity", participantHandler.RemoveParticipant)
	lk.POST("/rooms/:room/participants/:identity/mute", participantHandler.MuteTrack)
	
	// Webhook
	lk.POST("/webhook", webhookHandler.HandleWebhook)
}
