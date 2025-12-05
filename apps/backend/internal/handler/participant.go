package handler

import (
	"context"
	"net/http"

	"myapp/internal/livekit"

	"github.com/labstack/echo/v4"
	lkproto "github.com/livekit/protocol/livekit"
)

type ParticipantHandler struct {
	client *livekit.Client
}

func NewParticipantHandler(client *livekit.Client) *ParticipantHandler {
	return &ParticipantHandler{client: client}
}

// ListParticipants lists all participants in a room
func (h *ParticipantHandler) ListParticipants(c echo.Context) error {
	roomName := c.Param("room")
	if roomName == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room name is required"})
	}

	res, err := h.client.RoomService().ListParticipants(context.Background(), &lkproto.ListParticipantsRequest{
		Room: roomName,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, res.Participants)
}

// RemoveParticipant removes a participant from a room
func (h *ParticipantHandler) RemoveParticipant(c echo.Context) error {
	roomName := c.Param("room")
	identity := c.Param("identity")

	if roomName == "" || identity == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room and identity are required"})
	}

	_, err := h.client.RoomService().RemoveParticipant(context.Background(), &lkproto.RoomParticipantIdentity{
		Room:     roomName,
		Identity: identity,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, StatusResponse{Status: "removed"})
}

// MuteTrack mutes or unmutes a participant's track
func (h *ParticipantHandler) MuteTrack(c echo.Context) error {
	roomName := c.Param("room")
	identity := c.Param("identity")

	var req MuteTrackRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request"})
	}

	if roomName == "" || identity == "" || req.TrackSid == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room, identity, and trackSid are required"})
	}

	res, err := h.client.RoomService().MutePublishedTrack(context.Background(), &lkproto.MuteRoomTrackRequest{
		Room:     roomName,
		Identity: identity,
		TrackSid: req.TrackSid,
		Muted:    req.Muted,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}
