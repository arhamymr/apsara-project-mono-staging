package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

// AuthConfig holds configuration for the auth middleware
type AuthConfig struct {
	ConvexURL string
}

// UserInfo represents the authenticated user
type UserInfo struct {
	UserID string `json:"userId"`
	Email  string `json:"email,omitempty"`
}

// Simple in-memory cache for session validation (use Redis in production)
var sessionCache = make(map[string]*cachedSession)

type cachedSession struct {
	user      *UserInfo
	expiresAt time.Time
}

// AuthMiddleware validates user authentication via Convex session
func AuthMiddleware(cfg AuthConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			var userID string

			// Method 1: Check X-User-ID header (trusted internal services only)
			// In production, this should only be allowed from trusted internal IPs
			userID = c.Request().Header.Get("X-User-ID")

			// Method 2: Validate session with Convex by forwarding cookies
			if userID == "" && cfg.ConvexURL != "" {
				user, err := validateSessionWithConvex(cfg.ConvexURL, c.Request())
				if err == nil && user != nil {
					userID = user.UserID
				}
			}

			if userID == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "authentication required",
				})
			}

			// Store user ID in context
			c.Set("userId", userID)

			return next(c)
		}
	}
}

// validateSessionWithConvex validates the session by forwarding cookies to Convex
func validateSessionWithConvex(convexURL string, originalReq *http.Request) (*UserInfo, error) {
	// Get all cookies from the original request
	cookies := originalReq.Cookies()
	if len(cookies) == 0 {
		return nil, fmt.Errorf("no cookies found")
	}

	// Build cache key from relevant auth cookies
	cacheKey := buildCacheKey(cookies)
	
	// Check cache first
	if cached, ok := sessionCache[cacheKey]; ok {
		if time.Now().Before(cached.expiresAt) {
			return cached.user, nil
		}
		// Cache expired, remove it
		delete(sessionCache, cacheKey)
	}

	// Create request to Convex validate-session endpoint
	req, err := http.NewRequest("POST", convexURL+"/api/validate-session", strings.NewReader("{}"))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	
	// Forward all cookies from the original request
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}

	// Also forward the Authorization header if present
	if auth := originalReq.Header.Get("Authorization"); auth != "" {
		req.Header.Set("Authorization", auth)
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Convex session validation request failed: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("validation failed with status %d", resp.StatusCode)
	}

	var result struct {
		Valid  bool   `json:"valid"`
		UserID string `json:"userId"`
		Email  string `json:"email"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if !result.Valid || result.UserID == "" {
		return nil, fmt.Errorf("invalid session")
	}

	user := &UserInfo{
		UserID: result.UserID,
		Email:  result.Email,
	}

	// Cache the result for 5 minutes
	sessionCache[cacheKey] = &cachedSession{
		user:      user,
		expiresAt: time.Now().Add(5 * time.Minute),
	}

	return user, nil
}

// buildCacheKey creates a cache key from auth-related cookies
func buildCacheKey(cookies []*http.Cookie) string {
	var parts []string
	for _, cookie := range cookies {
		// Only include auth-related cookies in the cache key
		if strings.Contains(strings.ToLower(cookie.Name), "auth") ||
			strings.Contains(strings.ToLower(cookie.Name), "session") ||
			strings.Contains(strings.ToLower(cookie.Name), "token") {
			parts = append(parts, cookie.Name+"="+cookie.Value)
		}
	}
	return strings.Join(parts, ";")
}
