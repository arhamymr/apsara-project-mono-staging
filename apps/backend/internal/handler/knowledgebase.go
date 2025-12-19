package handler

import (
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

// KnowledgeBase represents a knowledge base entity
type KnowledgeBase struct {
	ID          int                       `json:"id"`
	Title       string                    `json:"title"`
	Collections []KnowledgeBaseCollection `json:"collections,omitempty"`
	CreatedAt   string                    `json:"created_at,omitempty"`
	UpdatedAt   string                    `json:"updated_at,omitempty"`
}

// KnowledgeBaseCollection represents a collection within a knowledge base
type KnowledgeBaseCollection struct {
	ID              int     `json:"id"`
	KnowledgeBaseID int     `json:"knowledge_base_id"`
	Name            string  `json:"name"`
	Description     *string `json:"description,omitempty"`
	SourcesCount    int     `json:"sources_count"`
	CreatedAt       string  `json:"created_at,omitempty"`
	UpdatedAt       string  `json:"updated_at,omitempty"`
}

// KnowledgeBaseHandler handles knowledge base operations
type KnowledgeBaseHandler struct {
	mu          sync.RWMutex
	kbs         map[int]*KnowledgeBase
	collections map[int]*KnowledgeBaseCollection
	nextKBID    int
	nextCollID  int
}

// NewKnowledgeBaseHandler creates a new knowledge base handler
func NewKnowledgeBaseHandler() *KnowledgeBaseHandler {
	return &KnowledgeBaseHandler{
		kbs:         make(map[int]*KnowledgeBase),
		collections: make(map[int]*KnowledgeBaseCollection),
		nextKBID:    1,
		nextCollID:  1,
	}
}

// ListKnowledgeBases handles GET /knowledge-bases
func (h *KnowledgeBaseHandler) ListKnowledgeBases(c echo.Context) error {
	h.mu.RLock()
	defer h.mu.RUnlock()

	kbList := make([]KnowledgeBase, 0, len(h.kbs))
	for _, kb := range h.kbs {
		kbCopy := *kb
		kbCopy.Collections = h.getCollectionsForKB(kb.ID)
		kbList = append(kbList, kbCopy)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"knowledgebases": kbList,
	})
}

// CreateKnowledgeBase handles POST /knowledge-bases
func (h *KnowledgeBaseHandler) CreateKnowledgeBase(c echo.Context) error {
	var req struct {
		Title string `json:"title"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	if req.Title == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "title is required",
		})
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	now := time.Now().UTC().Format(time.RFC3339)
	kb := &KnowledgeBase{
		ID:          h.nextKBID,
		Title:       req.Title,
		Collections: []KnowledgeBaseCollection{},
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	h.kbs[kb.ID] = kb
	h.nextKBID++

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"knowledge_base": kb,
	})
}

// DeleteKnowledgeBase handles DELETE /knowledge-bases/:id
func (h *KnowledgeBaseHandler) DeleteKnowledgeBase(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid id",
		})
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.kbs[id]; !exists {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "knowledge base not found",
		})
	}

	// Delete associated collections
	for collID, coll := range h.collections {
		if coll.KnowledgeBaseID == id {
			delete(h.collections, collID)
		}
	}

	delete(h.kbs, id)

	return c.JSON(http.StatusOK, map[string]string{
		"message": "deleted successfully",
	})
}

// CreateCollection handles POST /knowledge-bases/collections
func (h *KnowledgeBaseHandler) CreateCollection(c echo.Context) error {
	var req struct {
		KnowledgeBaseID int     `json:"knowledge_base_id"`
		Name            string  `json:"name"`
		Description     *string `json:"description"`
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

	if req.KnowledgeBaseID == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "knowledge_base_id is required",
		})
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.kbs[req.KnowledgeBaseID]; !exists {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "knowledge base not found",
		})
	}

	now := time.Now().UTC().Format(time.RFC3339)
	coll := &KnowledgeBaseCollection{
		ID:              h.nextCollID,
		KnowledgeBaseID: req.KnowledgeBaseID,
		Name:            req.Name,
		Description:     req.Description,
		SourcesCount:    0,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	h.collections[coll.ID] = coll
	h.nextCollID++

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"collection": coll,
	})
}

// getCollectionsForKB returns all collections for a knowledge base (must be called with lock held)
func (h *KnowledgeBaseHandler) getCollectionsForKB(kbID int) []KnowledgeBaseCollection {
	var result []KnowledgeBaseCollection
	for _, coll := range h.collections {
		if coll.KnowledgeBaseID == kbID {
			result = append(result, *coll)
		}
	}
	return result
}
