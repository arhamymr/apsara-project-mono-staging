package handler

import (
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"myapp/internal/storage"

	"github.com/labstack/echo/v4"
)

type StorageHandler struct {
	r2 *storage.R2Client
}

func NewStorageHandler(r2 *storage.R2Client) *StorageHandler {
	return &StorageHandler{r2: r2}
}

// getUserPrefix returns the user-scoped prefix for storage isolation
// Format: users/{userId}/
func getUserPrefix(c echo.Context) string {
	userId := c.Get("userId")
	if userId == nil || userId == "" {
		return ""
	}
	return fmt.Sprintf("users/%s/", userId)
}

// buildUserScopedKey prepends the user prefix to ensure isolation
func buildUserScopedKey(userPrefix, key string) string {
	if userPrefix == "" {
		return key
	}
	// If key already has user prefix, return as-is
	if strings.HasPrefix(key, userPrefix) {
		return key
	}
	return userPrefix + key
}

// validateKeyAccess checks if the user has access to the given key
func validateKeyAccess(userPrefix, key string) bool {
	if userPrefix == "" {
		return false // No user context = no access
	}
	return strings.HasPrefix(key, userPrefix)
}

// ListObjects handles GET /storage/list
func (h *StorageHandler) ListObjects(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	// User's requested prefix (relative to their root)
	requestedPrefix := c.QueryParam("prefix")
	// Build the actual prefix scoped to this user
	scopedPrefix := buildUserScopedKey(userPrefix, requestedPrefix)

	result, err := h.r2.List(c.Request().Context(), scopedPrefix)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from keys so frontend sees relative paths
	for i := range result.Folders {
		result.Folders[i].Key = strings.TrimPrefix(result.Folders[i].Key, userPrefix)
	}
	for i := range result.Files {
		result.Files[i].Key = strings.TrimPrefix(result.Files[i].Key, userPrefix)
	}
	result.Prefix = strings.TrimPrefix(result.Prefix, userPrefix)

	return c.JSON(http.StatusOK, result)
}

// UploadObject handles POST /storage/upload
func (h *StorageHandler) UploadObject(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "file is required",
		})
	}

	prefix := c.FormValue("prefix")
	// Scope the key to this user
	scopedPrefix := buildUserScopedKey(userPrefix, prefix)
	key := scopedPrefix + file.Filename

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to open file",
		})
	}
	defer src.Close()

	contentType := file.Header.Get("Content-Type")
	entry, err := h.r2.Upload(c.Request().Context(), key, src, contentType)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from response
	entry.Key = strings.TrimPrefix(entry.Key, userPrefix)

	return c.JSON(http.StatusOK, entry)
}

// DeleteObject handles DELETE /storage/object
func (h *StorageHandler) DeleteObject(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	key := c.QueryParam("key")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	// Scope the key to this user
	scopedKey := buildUserScopedKey(userPrefix, key)

	// Validate user has access to this key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	recursive := c.QueryParam("recursive") == "1" || c.QueryParam("recursive") == "true"

	err := h.r2.Delete(c.Request().Context(), scopedKey, recursive)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "deleted successfully",
	})
}

// CreateFolder handles POST /storage/folder
func (h *StorageHandler) CreateFolder(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	var req struct {
		Prefix string `json:"prefix"`
		Name   string `json:"name"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	if req.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "name is required",
		})
	}

	// Scope the prefix to this user
	scopedPrefix := buildUserScopedKey(userPrefix, req.Prefix)

	entry, err := h.r2.CreateFolder(c.Request().Context(), scopedPrefix, req.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from response
	entry.Key = strings.TrimPrefix(entry.Key, userPrefix)

	return c.JSON(http.StatusOK, entry)
}

// GetDownloadURL handles GET /storage/download-url
func (h *StorageHandler) GetDownloadURL(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	key := c.QueryParam("key")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	// Scope the key to this user
	scopedKey := buildUserScopedKey(userPrefix, key)

	// Validate user has access to this key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	ttlStr := c.QueryParam("ttl")
	ttl := 600 // default 10 minutes
	if ttlStr != "" {
		if parsed, err := strconv.Atoi(ttlStr); err == nil {
			ttl = parsed
		}
	}

	url, err := h.r2.GetPresignedURL(c.Request().Context(), scopedKey, time.Duration(ttl)*time.Second)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"url": url,
	})
}

// ProxyObject handles GET /storage/proxy/:key for proxying R2 objects
func (h *StorageHandler) ProxyObject(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	key := c.Param("*")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	// Scope the key to this user
	scopedKey := buildUserScopedKey(userPrefix, key)

	// Validate user has access to this key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	url, err := h.r2.GetPresignedURL(c.Request().Context(), scopedKey, 5*time.Minute)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	resp, err := http.Get(url)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": fmt.Sprintf("failed to fetch object: %v", err),
		})
	}
	defer resp.Body.Close()

	c.Response().Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	c.Response().Header().Set("Cache-Control", "public, max-age=31536000")

	_, err = io.Copy(c.Response().Writer, resp.Body)
	return err
}

// RenameObject handles POST /storage/rename
func (h *StorageHandler) RenameObject(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	var req struct {
		Key     string `json:"key"`
		NewName string `json:"new_name"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	if req.Key == "" || req.NewName == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key and new_name are required",
		})
	}

	// Scope the key to this user
	scopedKey := buildUserScopedKey(userPrefix, req.Key)

	// Validate user has access to this key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	entry, err := h.r2.Rename(c.Request().Context(), scopedKey, req.NewName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from response
	entry.Key = strings.TrimPrefix(entry.Key, userPrefix)

	return c.JSON(http.StatusOK, entry)
}

// MoveObject handles POST /storage/move
func (h *StorageHandler) MoveObject(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	var req struct {
		Key        string `json:"key"`
		DestPrefix string `json:"dest_prefix"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	if req.Key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	// Scope both source key and destination to this user
	scopedKey := buildUserScopedKey(userPrefix, req.Key)
	scopedDestPrefix := buildUserScopedKey(userPrefix, req.DestPrefix)

	// Validate user has access to source key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	entry, err := h.r2.Move(c.Request().Context(), scopedKey, scopedDestPrefix)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from response
	entry.Key = strings.TrimPrefix(entry.Key, userPrefix)

	return c.JSON(http.StatusOK, entry)
}

// SetVisibility handles POST /storage/visibility
func (h *StorageHandler) SetVisibility(c echo.Context) error {
	userPrefix := getUserPrefix(c)
	if userPrefix == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "authentication required",
		})
	}

	var req struct {
		Key        string `json:"key"`
		Visibility string `json:"visibility"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	if req.Key == "" || (req.Visibility != "public" && req.Visibility != "private") {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key and visibility (public/private) are required",
		})
	}

	// Scope the key to this user
	scopedKey := buildUserScopedKey(userPrefix, req.Key)

	// Validate user has access to this key
	if !validateKeyAccess(userPrefix, scopedKey) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"error": "access denied",
		})
	}

	entry, err := h.r2.SetVisibility(c.Request().Context(), scopedKey, req.Visibility)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	// Strip user prefix from response
	entry.Key = strings.TrimPrefix(entry.Key, userPrefix)

	return c.JSON(http.StatusOK, entry)
}
