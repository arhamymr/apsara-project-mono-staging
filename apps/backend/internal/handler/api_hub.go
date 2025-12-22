package handler

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

// APIHubHandler handles API Hub related endpoints
type APIHubHandler struct {
	// In-memory rate limiter (in production, use Redis)
	rateLimiter map[string]*RateLimitEntry
	mu          sync.RWMutex
}

type RateLimitEntry struct {
	Count     int
	ResetTime time.Time
}

// ValidatedKey represents a validated API key
type ValidatedKey struct {
	KeyID       string   `json:"keyId"`
	UserID      string   `json:"userId"`
	Permissions []string `json:"permissions"`
	RateLimit   int      `json:"rateLimit"`
}

// LeadSubmission represents an incoming lead from external API
type LeadSubmission struct {
	Name       string                 `json:"name" validate:"required"`
	Email      string                 `json:"email" validate:"required,email"`
	Phone      string                 `json:"phone,omitempty"`
	Company    string                 `json:"company,omitempty"`
	Source     string                 `json:"source,omitempty"`
	Notes      string                 `json:"notes,omitempty"`
	PipelineId string                 `json:"pipelineId,omitempty"`
	ColumnId   string                 `json:"columnId,omitempty"`
	Custom     map[string]interface{} `json:"custom,omitempty"`
}

// LeadResponse represents the response after creating a lead
type LeadResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

// BlogResponse represents a blog post in API response
type BlogResponse struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Slug        string   `json:"slug"`
	Excerpt     string   `json:"excerpt,omitempty"`
	Content     string   `json:"content,omitempty"`
	CoverImage  string   `json:"coverImage,omitempty"`
	AuthorName  string   `json:"authorName,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	PublishedAt string   `json:"publishedAt,omitempty"`
}

// PaginatedResponse wraps paginated data
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Pagination Pagination  `json:"pagination"`
}

type Pagination struct {
	Page    int  `json:"page"`
	PerPage int  `json:"perPage"`
	Total   int  `json:"total"`
	HasMore bool `json:"hasMore"`
}

// NewAPIHubHandler creates a new API Hub handler
func NewAPIHubHandler() *APIHubHandler {
	return &APIHubHandler{
		rateLimiter: make(map[string]*RateLimitEntry),
	}
}

// HashAPIKey hashes an API key using SHA-256
func HashAPIKey(key string) string {
	hash := sha256.Sum256([]byte(key))
	return hex.EncodeToString(hash[:])
}

// APIKeyMiddleware validates API keys and enforces rate limits
func (h *APIHubHandler) APIKeyMiddleware(convexURL string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			startTime := time.Now()

			fmt.Printf("API Request: %s %s\n", c.Request().Method, c.Path())

			// Store convexURL in context for handlers
			c.Set("convexURL", convexURL)

			// Extract API key from Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				fmt.Println("Missing Authorization header")
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Missing Authorization header",
				})
			}

			// Support both "Bearer <key>" and just "<key>"
			apiKey := strings.TrimPrefix(authHeader, "Bearer ")
			if apiKey == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid API key format",
				})
			}

			// Hash the key for lookup
			keyHash := HashAPIKey(apiKey)

			// Validate key against Convex (in production, cache this)
			validatedKey, err := h.validateKeyWithConvex(convexURL, keyHash)
			if err != nil || validatedKey == nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid or expired API key",
				})
			}

			// Check rate limit
			if !h.checkRateLimit(validatedKey.KeyID, validatedKey.RateLimit) {
				return c.JSON(http.StatusTooManyRequests, map[string]string{
					"error": "Rate limit exceeded",
				})
			}

			// Store validated key in context
			c.Set("apiKey", validatedKey)
			c.Set("startTime", startTime)

			// Execute the handler
			err = next(c)

			// Log usage (async in production)
			go h.logUsage(convexURL, validatedKey, c, startTime)

			return err
		}
	}
}

// validateKeyWithConvex validates an API key hash against Convex
func (h *APIHubHandler) validateKeyWithConvex(convexURL, keyHash string) (*ValidatedKey, error) {
	if convexURL == "" {
		// For development without Convex configured, return mock
		fmt.Println("Warning: CONVEX_URL not configured, using mock validation")
		return &ValidatedKey{
			KeyID:       "mock_key_id",
			UserID:      "mock_user_id",
			Permissions: []string{"blogs:read", "leads:write", "leads:read"},
			RateLimit:   100,
		}, nil
	}

	// Call Convex HTTP endpoint
	reqBody, _ := json.Marshal(map[string]string{"keyHash": keyHash})
	validateURL := convexURL + "/api/validate-key"
	fmt.Printf("Validating API key against: %s\n", validateURL)
	fmt.Printf("Full key hash: %s\n", keyHash)
	
	resp, err := http.Post(validateURL, "application/json", strings.NewReader(string(reqBody)))
	if err != nil {
		fmt.Printf("Convex validation request failed: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Read the full response body for debugging
	bodyBytes, _ := io.ReadAll(resp.Body)
	fmt.Printf("Convex response status: %d, body: %s\n", resp.StatusCode, string(bodyBytes))

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Convex validation returned status: %d\n", resp.StatusCode)
		return nil, fmt.Errorf("validation failed with status %d", resp.StatusCode)
	}

	var result struct {
		Valid       bool     `json:"valid"`
		KeyID       string   `json:"keyId"`
		UserID      string   `json:"userId"`
		Permissions []string `json:"permissions"`
		RateLimit   int      `json:"rateLimit"`
	}

	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		fmt.Printf("Failed to decode Convex response: %v\n", err)
		return nil, err
	}

	fmt.Printf("Convex validation result: valid=%v, keyId=%s\n", result.Valid, result.KeyID)

	if !result.Valid {
		return nil, nil
	}

	return &ValidatedKey{
		KeyID:       result.KeyID,
		UserID:      result.UserID,
		Permissions: result.Permissions,
		RateLimit:   result.RateLimit,
	}, nil
}

// checkRateLimit checks if the request is within rate limits
func (h *APIHubHandler) checkRateLimit(keyID string, limit int) bool {
	h.mu.Lock()
	defer h.mu.Unlock()

	now := time.Now()
	entry, exists := h.rateLimiter[keyID]

	if !exists || now.After(entry.ResetTime) {
		h.rateLimiter[keyID] = &RateLimitEntry{
			Count:     1,
			ResetTime: now.Add(time.Minute),
		}
		return true
	}

	if entry.Count >= limit {
		return false
	}

	entry.Count++
	return true
}

// logUsage logs API usage to Convex
func (h *APIHubHandler) logUsage(convexURL string, key *ValidatedKey, c echo.Context, startTime time.Time) {
	responseTime := time.Since(startTime).Milliseconds()
	
	// Log format for debugging
	fmt.Printf("API Usage: key=%s endpoint=%s method=%s time=%dms\n",
		key.KeyID, c.Path(), c.Request().Method, responseTime)

	if convexURL == "" {
		return
	}

	// Call Convex HTTP endpoint to log usage
	reqBody, _ := json.Marshal(map[string]interface{}{
		"apiKeyId":       key.KeyID,
		"userId":         key.UserID,
		"endpoint":       c.Path(),
		"method":         c.Request().Method,
		"statusCode":     c.Response().Status,
		"responseTimeMs": responseTime,
		"ipAddress":      c.RealIP(),
		"userAgent":      c.Request().UserAgent(),
	})

	resp, err := http.Post(convexURL+"/api/log-usage", "application/json", strings.NewReader(string(reqBody)))
	if err != nil {
		fmt.Printf("Failed to log API usage: %v\n", err)
		return
	}
	resp.Body.Close()
}

// HasPermission checks if the API key has a specific permission
func HasPermission(key *ValidatedKey, permission string) bool {
	for _, p := range key.Permissions {
		if p == permission {
			return true
		}
	}
	return false
}

// CreateLead handles POST /api/v1/leads
func (h *APIHubHandler) CreateLead(c echo.Context) error {
	key := c.Get("apiKey").(*ValidatedKey)
	
	if !HasPermission(key, "leads:write") {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "Missing permission: leads:write",
		})
	}

	var lead LeadSubmission
	if err := c.Bind(&lead); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if lead.Name == "" || lead.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Name and email are required",
		})
	}

	convexURL := c.Get("convexURL").(string)
	if convexURL == "" {
		// Mock response for development without Convex
		response := LeadResponse{
			ID:        fmt.Sprintf("lead_%d", time.Now().UnixNano()),
			Name:      lead.Name,
			Email:     lead.Email,
			Status:    "new",
			CreatedAt: time.Now().Format(time.RFC3339),
		}
		return c.JSON(http.StatusCreated, response)
	}

	// Call Convex to create the lead
	reqData := map[string]interface{}{
		"userId":  key.UserID,
		"name":    lead.Name,
		"email":   lead.Email,
		"phone":   lead.Phone,
		"company": lead.Company,
		"source":  lead.Source,
		"notes":   lead.Notes,
	}
	
	// Add optional pipelineId or columnId if provided
	if lead.PipelineId != "" {
		reqData["pipelineId"] = lead.PipelineId
	}
	if lead.ColumnId != "" {
		reqData["columnId"] = lead.ColumnId
	}
	
	reqBody, _ := json.Marshal(reqData)

	resp, err := http.Post(convexURL+"/api/leads", "application/json", strings.NewReader(string(reqBody)))
	if err != nil {
		fmt.Printf("Convex lead creation error: %v\n", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create lead",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return c.JSON(resp.StatusCode, map[string]string{
			"error": "Failed to create lead in database",
		})
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	return c.JSON(http.StatusCreated, result)
}

// BulkCreateLeads handles POST /api/v1/leads/bulk
func (h *APIHubHandler) BulkCreateLeads(c echo.Context) error {
	key := c.Get("apiKey").(*ValidatedKey)
	
	if !HasPermission(key, "leads:write") {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "Missing permission: leads:write",
		})
	}

	var leads []LeadSubmission
	if err := c.Bind(&leads); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if len(leads) > 100 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Maximum 100 leads per bulk request",
		})
	}

	responses := make([]LeadResponse, 0, len(leads))
	for _, lead := range leads {
		if lead.Name == "" || lead.Email == "" {
			continue
		}
		responses = append(responses, LeadResponse{
			ID:        fmt.Sprintf("lead_%d", time.Now().UnixNano()),
			Name:      lead.Name,
			Email:     lead.Email,
			Status:    "pending",
			CreatedAt: time.Now().Format(time.RFC3339),
		})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"created": len(responses),
		"leads":   responses,
	})
}

// ListLeads handles GET /api/v1/leads
func (h *APIHubHandler) ListLeads(c echo.Context) error {
	key := c.Get("apiKey").(*ValidatedKey)
	
	if !HasPermission(key, "leads:read") {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "Missing permission: leads:read",
		})
	}

	// In production, fetch from Convex with pagination
	// Mock response for now
	return c.JSON(http.StatusOK, PaginatedResponse{
		Data: []LeadResponse{},
		Pagination: Pagination{
			Page:    1,
			PerPage: 10,
			Total:   0,
			HasMore: false,
		},
	})
}

// ListBlogs handles GET /api/v1/blogs
func (h *APIHubHandler) ListBlogs(c echo.Context) error {
	key := c.Get("apiKey").(*ValidatedKey)
	
	if !HasPermission(key, "blogs:read") {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "Missing permission: blogs:read",
		})
	}

	// In production, fetch from Convex with pagination
	// Mock response for now
	return c.JSON(http.StatusOK, PaginatedResponse{
		Data: []BlogResponse{},
		Pagination: Pagination{
			Page:    1,
			PerPage: 10,
			Total:   0,
			HasMore: false,
		},
	})
}

// GetBlog handles GET /api/v1/blogs/:slug
func (h *APIHubHandler) GetBlog(c echo.Context) error {
	key := c.Get("apiKey").(*ValidatedKey)
	
	if !HasPermission(key, "blogs:read") {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "Missing permission: blogs:read",
		})
	}

	slug := c.Param("slug")
	if slug == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Slug is required",
		})
	}

	// In production, fetch from Convex
	return c.JSON(http.StatusNotFound, map[string]string{
		"error": "Blog not found",
	})
}

// GetOpenAPISpec returns the OpenAPI specification
func (h *APIHubHandler) GetOpenAPISpec(c echo.Context) error {
	spec := map[string]interface{}{
		"openapi": "3.0.0",
		"info": map[string]interface{}{
			"title":       "Apsara API",
			"version":     "1.0.0",
			"description": "Public API for accessing blogs and submitting leads",
		},
		"servers": []map[string]string{
			{"url": "https://api.yourapp.com", "description": "Production"},
		},
		"security": []map[string][]string{
			{"bearerAuth": {}},
		},
		"components": map[string]interface{}{
			"securitySchemes": map[string]interface{}{
				"bearerAuth": map[string]string{
					"type":   "http",
					"scheme": "bearer",
				},
			},
		},
		"paths": map[string]interface{}{
			"/api/v1/blogs": map[string]interface{}{
				"get": map[string]interface{}{
					"summary":     "List published blogs",
					"description": "Returns a paginated list of published blog posts",
					"tags":        []string{"Blogs"},
					"parameters": []map[string]interface{}{
						{"name": "page", "in": "query", "schema": map[string]string{"type": "integer"}},
						{"name": "perPage", "in": "query", "schema": map[string]string{"type": "integer"}},
					},
					"responses": map[string]interface{}{
						"200": map[string]string{"description": "Success"},
						"401": map[string]string{"description": "Unauthorized"},
					},
				},
			},
			"/api/v1/leads": map[string]interface{}{
				"post": map[string]interface{}{
					"summary":     "Create a lead",
					"description": "Submit a new lead from external source",
					"tags":        []string{"Leads"},
					"requestBody": map[string]interface{}{
						"required": true,
						"content": map[string]interface{}{
							"application/json": map[string]interface{}{
								"schema": map[string]interface{}{
									"type": "object",
									"required": []string{"name", "email"},
									"properties": map[string]interface{}{
										"name":    map[string]string{"type": "string"},
										"email":   map[string]string{"type": "string", "format": "email"},
										"phone":   map[string]string{"type": "string"},
										"company": map[string]string{"type": "string"},
										"source":  map[string]string{"type": "string"},
										"notes":   map[string]string{"type": "string"},
									},
								},
							},
						},
					},
					"responses": map[string]interface{}{
						"201": map[string]string{"description": "Lead created"},
						"400": map[string]string{"description": "Bad request"},
						"401": map[string]string{"description": "Unauthorized"},
					},
				},
			},
		},
	}

	return c.JSON(http.StatusOK, spec)
}

// HealthCheck for API v1
func (h *APIHubHandler) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"version": "1.0.0",
		"time":    time.Now().Format(time.RFC3339),
	})
}
