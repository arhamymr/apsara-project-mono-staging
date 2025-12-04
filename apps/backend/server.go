package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
	"github.com/livekit/protocol/webhook"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

var (
	livekitHost   = getEnv("LIVEKIT_HOST", "https://your-project.livekit.cloud")
	livekitAPIKey = getEnv("LIVEKIT_API_KEY", "")
	livekitSecret = getEnv("LIVEKIT_API_SECRET", "")
)

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	}))

	// Health check
	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	// LiveKit routes
	lk := e.Group("/livekit")
	lk.POST("/token", handleGetToken)
	lk.POST("/rooms", handleCreateRoom)
	lk.GET("/rooms", handleListRooms)
	lk.DELETE("/rooms/:room", handleDeleteRoom)
	lk.GET("/rooms/:room/participants", handleListParticipants)
	lk.DELETE("/rooms/:room/participants/:identity", handleRemoveParticipant)
	lk.POST("/rooms/:room/participants/:identity/mute", handleMuteTrack)
	lk.POST("/webhook", handleWebhook)

	e.Logger.Fatal(e.Start(":1323"))
}


// Token request/response types
type TokenRequest struct {
	Room     string `json:"room"`
	Identity string `json:"identity"`
	Name     string `json:"name,omitempty"`
}

type TokenResponse struct {
	Token string `json:"token"`
}

// handleGetToken generates a JWT token for room access
func handleGetToken(c echo.Context) error {
	var req TokenRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	if req.Room == "" || req.Identity == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room and identity are required"})
	}

	token, err := getJoinToken(req.Room, req.Identity, req.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, TokenResponse{Token: token})
}

func getJoinToken(room, identity, name string) (string, error) {
	at := auth.NewAccessToken(livekitAPIKey, livekitSecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
	at.SetVideoGrant(grant).
		SetIdentity(identity).
		SetName(name).
		SetValidFor(time.Hour)

	return at.ToJWT()
}

// Room management handlers
type CreateRoomRequest struct {
	Name            string `json:"name"`
	EmptyTimeout    uint32 `json:"emptyTimeout,omitempty"`
	MaxParticipants uint32 `json:"maxParticipants,omitempty"`
}

func getRoomClient() *lksdk.RoomServiceClient {
	return lksdk.NewRoomServiceClient(livekitHost, livekitAPIKey, livekitSecret)
}

func handleCreateRoom(c echo.Context) error {
	var req CreateRoomRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	if req.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room name is required"})
	}

	roomClient := getRoomClient()
	room, err := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
		Name:            req.Name,
		EmptyTimeout:    req.EmptyTimeout,
		MaxParticipants: req.MaxParticipants,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, room)
}

func handleListRooms(c echo.Context) error {
	roomClient := getRoomClient()
	res, err := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, res.Rooms)
}

func handleDeleteRoom(c echo.Context) error {
	roomName := c.Param("room")
	if roomName == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room name is required"})
	}

	roomClient := getRoomClient()
	_, err := roomClient.DeleteRoom(context.Background(), &livekit.DeleteRoomRequest{
		Room: roomName,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "deleted"})
}


// Participant management handlers
func handleListParticipants(c echo.Context) error {
	roomName := c.Param("room")
	if roomName == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room name is required"})
	}

	roomClient := getRoomClient()
	res, err := roomClient.ListParticipants(context.Background(), &livekit.ListParticipantsRequest{
		Room: roomName,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, res.Participants)
}

func handleRemoveParticipant(c echo.Context) error {
	roomName := c.Param("room")
	identity := c.Param("identity")

	if roomName == "" || identity == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room and identity are required"})
	}

	roomClient := getRoomClient()
	_, err := roomClient.RemoveParticipant(context.Background(), &livekit.RoomParticipantIdentity{
		Room:     roomName,
		Identity: identity,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "removed"})
}

type MuteTrackRequest struct {
	TrackSid string `json:"trackSid"`
	Muted    bool   `json:"muted"`
}

func handleMuteTrack(c echo.Context) error {
	roomName := c.Param("room")
	identity := c.Param("identity")

	var req MuteTrackRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	if roomName == "" || identity == "" || req.TrackSid == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "room, identity, and trackSid are required"})
	}

	roomClient := getRoomClient()
	res, err := roomClient.MutePublishedTrack(context.Background(), &livekit.MuteRoomTrackRequest{
		Room:     roomName,
		Identity: identity,
		TrackSid: req.TrackSid,
		Muted:    req.Muted,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

// Webhook handler
func handleWebhook(c echo.Context) error {
	authProvider := auth.NewSimpleKeyProvider(livekitAPIKey, livekitSecret)

	event, err := webhook.ReceiveWebhookEvent(c.Request(), authProvider)
	if err != nil {
		c.Logger().Errorf("webhook validation failed: %v", err)
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid webhook"})
	}

	// Handle different webhook events
	switch event.GetEvent() {
	case webhook.EventRoomStarted:
		c.Logger().Infof("Room started: %s", event.Room.Name)
	case webhook.EventRoomFinished:
		c.Logger().Infof("Room finished: %s", event.Room.Name)
	case webhook.EventParticipantJoined:
		c.Logger().Infof("Participant joined: %s in room %s", event.Participant.Identity, event.Room.Name)
	case webhook.EventParticipantLeft:
		c.Logger().Infof("Participant left: %s from room %s", event.Participant.Identity, event.Room.Name)
	case webhook.EventTrackPublished:
		c.Logger().Infof("Track published: %s by %s", event.Track.Sid, event.Participant.Identity)
	case webhook.EventTrackUnpublished:
		c.Logger().Infof("Track unpublished: %s by %s", event.Track.Sid, event.Participant.Identity)
	default:
		c.Logger().Infof("Received webhook event: %s", event.GetEvent())
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "received"})
}
