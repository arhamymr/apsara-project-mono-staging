package router

import (
	"net/http"

	"myapp/internal/config"
	"myapp/internal/handler"
	"myapp/internal/livekit"
	"myapp/internal/middleware"
	"myapp/internal/storage"

	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
)

func Setup(e *echo.Echo, client *livekit.Client, r2 *storage.R2Client, cfg *config.Config) {
	// Middleware
	e.Use(echomiddleware.Logger())
	e.Use(echomiddleware.Recover())
	e.Use(echomiddleware.CORSWithConfig(echomiddleware.CORSConfig{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization, "X-Requested-With", "X-User-ID"},
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

	// Storage routes (R2) - with user authentication for isolation
	if r2 != nil {
		storageHandler := handler.NewStorageHandler(r2)
		st := e.Group("/storage")
		
		// Apply auth middleware to all storage routes
		st.Use(middleware.AuthMiddleware(middleware.AuthConfig{
			ConvexURL: cfg.ConvexURL,
		}))
		
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

	// Knowledge Base routes
	kbHandler := handler.NewKnowledgeBaseHandler()
	kb := e.Group("/knowledge-bases")
	kb.GET("", kbHandler.ListKnowledgeBases)
	kb.POST("", kbHandler.CreateKnowledgeBase)
	kb.DELETE("/:id", kbHandler.DeleteKnowledgeBase)
	kb.POST("/collections", kbHandler.CreateCollection)

	// API Hub routes (public API with API key authentication)
	apiHubHandler := handler.NewAPIHubHandler()
	
	api := e.Group("/api/v1")
	
	// Public endpoints (no auth required)
	api.GET("/health", apiHubHandler.HealthCheck)
	api.GET("/docs/openapi.json", apiHubHandler.GetOpenAPISpec)
	
	// Protected endpoints (require API key)
	apiProtected := api.Group("")
	apiProtected.Use(apiHubHandler.APIKeyMiddleware(cfg.ConvexURL))
	
	// Blog endpoints
	apiProtected.GET("/blogs", apiHubHandler.ListBlogs)
	apiProtected.GET("/blogs/:slug", apiHubHandler.GetBlog)
	
	// Lead endpoints
	apiProtected.POST("/leads", apiHubHandler.CreateLead)
	apiProtected.POST("/leads/bulk", apiHubHandler.BulkCreateLeads)
	apiProtected.GET("/leads", apiHubHandler.ListLeads)
}
