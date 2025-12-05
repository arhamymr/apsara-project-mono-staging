package livekit

import (
	"myapp/internal/config"

	lksdk "github.com/livekit/server-sdk-go/v2"
)

type Client struct {
	cfg *config.Config
}

func NewClient(cfg *config.Config) *Client {
	return &Client{cfg: cfg}
}

func (c *Client) RoomService() *lksdk.RoomServiceClient {
	return lksdk.NewRoomServiceClient(c.cfg.LivekitHost, c.cfg.LivekitAPIKey, c.cfg.LivekitSecret)
}

func (c *Client) APIKey() string {
	return c.cfg.LivekitAPIKey
}

func (c *Client) Secret() string {
	return c.cfg.LivekitSecret
}
