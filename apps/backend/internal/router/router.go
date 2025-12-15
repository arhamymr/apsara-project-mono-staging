package router

import (
	"net/http"

	"myapp/internal/config"
	"myapp/internal/handler"
	"myapp/internal/livekit"
	"myapp/internal/storage"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Setup(e *echo.Echo, client *livekit.Client, r2 *storage.R2Client, cfg *config.Config) {
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "*"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization, "X-Requested-With"},
		AllowCredentials: true,
	}))

	// Health check
	e.GET("/", handler.HealthCheck)
	e.GET("/health", handler.HealthCheck)

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

	// Storage routes (R2)
	if r2 != nil {
		storageHandler := handler.NewStorageHandler(r2)
		st := e.Group("/storage")
		st.GET("/list", storageHandler.ListObjects)
		st.POST("/upload", storageHandler.UploadObject)
		st.DELETE("/object", storageHandler.DeleteObject)
		st.POST("/folder", storageHandler.CreateFolder)
		st.GET("/download-url", storageHandler.GetDownloadURL)
		st.GET("/proxy/*", storageHandler.ProxyObject)
		st.POST("/rename", storageHandler.RenameObject)
		st.POST("/move", storageHandler.MoveObject)
		st.POST("/visibility", storageHandler.SetVisibility)
	}

	// Unsplash routes
	if cfg.UnsplashAccessKey != "" {
		unsplashHandler := handler.NewUnsplashHandler(cfg)
		us := e.Group("/unsplash")
		us.GET("/search", unsplashHandler.Search)
		us.GET("/download", unsplashHandler.TrackDownload)
	}
}
