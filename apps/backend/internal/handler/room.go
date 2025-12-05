package handler

import (
	"context"
	"net/http"

	"myapp/internal/livekit"

	"github.com/labstack/echo/v4"
	lkproto "github.com/livekit/protocol/livekit"
)

type RoomHandler struct {
	client *livekit.Client
}

func NewRoomHandler(client *livekit.Client) *RoomHandler {
	return &RoomHandler{client: client}
}

// CreateRoom creates a new LiveKit room
func (h *RoomHandler) CreateRoom(c echo.Context) error {
	var req CreateRoomRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request"})
	}

	if req.Name == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room name is required"})
	}

	room, err := h.client.RoomService().CreateRoom(context.Background(), &lkproto.CreateRoomRequest{
		Name:            req.Name,
		EmptyTimeout:    req.EmptyTimeout,
		MaxParticipants: req.MaxParticipants,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, room)
}

// ListRooms lists all LiveKit rooms
func (h *RoomHandler) ListRooms(c echo.Context) error {
	res, err := h.client.RoomService().ListRooms(context.Background(), &lkproto.ListRoomsRequest{})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, res.Rooms)
}

// DeleteRoom deletes a LiveKit room
func (h *RoomHandler) DeleteRoom(c echo.Context) error {
	roomName := c.Param("room")
	if roomName == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room name is required"})
	}

	_, err := h.client.RoomService().DeleteRoom(context.Background(), &lkproto.DeleteRoomRequest{
		Room: roomName,
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, StatusResponse{Status: "deleted"})
}
