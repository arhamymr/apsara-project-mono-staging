package handler

import (
	"fmt"
	"io"
	"net/http"
	"strconv"
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

// ListObjects handles GET /storage/list
func (h *StorageHandler) ListObjects(c echo.Context) error {
	prefix := c.QueryParam("prefix")

	result, err := h.r2.List(c.Request().Context(), prefix)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, result)
}

// UploadObject handles POST /storage/upload
func (h *StorageHandler) UploadObject(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "file is required",
		})
	}

	prefix := c.FormValue("prefix")
	key := prefix + file.Filename

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

	return c.JSON(http.StatusOK, entry)
}

// DeleteObject handles DELETE /storage/object
func (h *StorageHandler) DeleteObject(c echo.Context) error {
	key := c.QueryParam("key")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	recursive := c.QueryParam("recursive") == "1" || c.QueryParam("recursive") == "true"

	err := h.r2.Delete(c.Request().Context(), key, recursive)
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

	entry, err := h.r2.CreateFolder(c.Request().Context(), req.Prefix, req.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, entry)
}

// GetDownloadURL handles GET /storage/download-url
func (h *StorageHandler) GetDownloadURL(c echo.Context) error {
	key := c.QueryParam("key")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	ttlStr := c.QueryParam("ttl")
	ttl := 600 // default 10 minutes
	if ttlStr != "" {
		if parsed, err := strconv.Atoi(ttlStr); err == nil {
			ttl = parsed
		}
	}

	url, err := h.r2.GetPresignedURL(c.Request().Context(), key, time.Duration(ttl)*time.Second)
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
	key := c.Param("*")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "key is required",
		})
	}

	url, err := h.r2.GetPresignedURL(c.Request().Context(), key, 5*time.Minute)
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

	entry, err := h.r2.Rename(c.Request().Context(), req.Key, req.NewName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, entry)
}

// MoveObject handles POST /storage/move
func (h *StorageHandler) MoveObject(c echo.Context) error {
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

	entry, err := h.r2.Move(c.Request().Context(), req.Key, req.DestPrefix)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, entry)
}

// SetVisibility handles POST /storage/visibility
func (h *StorageHandler) SetVisibility(c echo.Context) error {
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

	entry, err := h.r2.SetVisibility(c.Request().Context(), req.Key, req.Visibility)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, entry)
}
