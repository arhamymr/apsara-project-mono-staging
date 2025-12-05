package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HealthCheck returns the server health status
func HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, StatusResponse{Status: "ok"})
}
