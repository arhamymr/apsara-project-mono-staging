package handler

import (
	"net/http"

	"myapp/internal/livekit"

	"github.com/labstack/echo/v4"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/webhook"
)

type WebhookHandler struct {
	client *livekit.Client
}

func NewWebhookHandler(client *livekit.Client) *WebhookHandler {
	return &WebhookHandler{client: client}
}

// HandleWebhook processes LiveKit webhook events
func (h *WebhookHandler) HandleWebhook(c echo.Context) error {
	authProvider := auth.NewSimpleKeyProvider(h.client.APIKey(), h.client.Secret())

	event, err := webhook.ReceiveWebhookEvent(c.Request(), authProvider)
	if err != nil {
		c.Logger().Errorf("webhook validation failed: %v", err)
		return c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "invalid webhook"})
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

	return c.JSON(http.StatusOK, StatusResponse{Status: "received"})
}
