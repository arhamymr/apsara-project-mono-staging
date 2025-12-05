package handler

// TokenRequest represents a request for a LiveKit token
type TokenRequest struct {
	Room     string `json:"room"`
	Identity string `json:"identity"`
	Name     string `json:"name,omitempty"`
}

// TokenResponse represents a token response
type TokenResponse struct {
	Token string `json:"token"`
}

// CreateRoomRequest represents a request to create a room
type CreateRoomRequest struct {
	Name            string `json:"name"`
	EmptyTimeout    uint32 `json:"emptyTimeout,omitempty"`
	MaxParticipants uint32 `json:"maxParticipants,omitempty"`
}

// MuteTrackRequest represents a request to mute a track
type MuteTrackRequest struct {
	TrackSid string `json:"trackSid"`
	Muted    bool   `json:"muted"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// StatusResponse represents a status response
type StatusResponse struct {
	Status string `json:"status"`
}
