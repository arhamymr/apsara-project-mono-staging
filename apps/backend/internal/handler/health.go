package handler

import (
	"net/http"
	"runtime"
	"time"

	"github.com/labstack/echo/v4"
)

var startTime = time.Now()

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Service   string `json:"service"`
	Timestamp string `json:"timestamp"`
	Uptime    string `json:"uptime"`
	Version   string `json:"version,omitempty"`
	GoVersion string `json:"go_version,omitempty"`
}

// HealthCheck returns the server health status
func HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, HealthResponse{
		Status:    "healthy",
		Service:   "backend",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Uptime:    time.Since(startTime).Round(time.Second).String(),
		Version:   "1.0.0",
		GoVersion: runtime.Version(),
	})
}
