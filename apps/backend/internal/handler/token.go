package handler

import (
	"net/http"
	"time"

	"myapp/internal/livekit"

	"github.com/labstack/echo/v4"
	"github.com/livekit/protocol/auth"
)

type TokenHandler struct {
	client *livekit.Client
}

func NewTokenHandler(client *livekit.Client) *TokenHandler {
	return &TokenHandler{client: client}
}

// GetToken generates a JWT token for room access
func (h *TokenHandler) GetToken(c echo.Context) error {
	var req TokenRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request"})
	}

	if req.Room == "" || req.Identity == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "room and identity are required"})
	}

	token, err := h.generateToken(req.Room, req.Identity, req.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, TokenResponse{Token: token})
}

func (h *TokenHandler) generateToken(room, identity, name string) (string, error) {
	at := auth.NewAccessToken(h.client.APIKey(), h.client.Secret())
	at.AddGrant(&auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}).
		SetIdentity(identity).
		SetName(name).
		SetValidFor(time.Hour)

	return at.ToJWT()
}
