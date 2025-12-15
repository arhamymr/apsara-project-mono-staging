package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"myapp/internal/config"

	"github.com/labstack/echo/v4"
)

type UnsplashHandler struct {
	accessKey string
	utmSource string
}

func NewUnsplashHandler(cfg *config.Config) *UnsplashHandler {
	return &UnsplashHandler{
		accessKey: cfg.UnsplashAccessKey,
		utmSource: cfg.UnsplashUTMSource,
	}
}

type UnsplashPhoto struct {
	ID     string `json:"id"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Alt    string `json:"alt_description"`
	URLs   struct {
		Raw     string `json:"raw"`
		Full    string `json:"full"`
		Regular string `json:"regular"`
		Small   string `json:"small"`
		Thumb   string `json:"thumb"`
	} `json:"urls"`
	Links struct {
		HTML             string `json:"html"`
		Download         string `json:"download"`
		DownloadLocation string `json:"download_location"`
	} `json:"links"`
	User struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Links    struct {
			HTML string `json:"html"`
		} `json:"links"`
	} `json:"user"`
}

type UnsplashSearchResponse struct {
	Total      int             `json:"total"`
	TotalPages int             `json:"total_pages"`
	Results    []UnsplashPhoto `json:"results"`
}

// Search handles GET /unsplash/search
func (h *UnsplashHandler) Search(c echo.Context) error {
	query := c.QueryParam("q")
	if query == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "query parameter 'q' is required",
		})
	}

	page := c.QueryParam("page")
	if page == "" {
		page = "1"
	}

	perPage := c.QueryParam("per_page")
	if perPage == "" {
		perPage = "12"
	}

	apiURL := fmt.Sprintf(
		"https://api.unsplash.com/search/photos?query=%s&page=%s&per_page=%s",
		url.QueryEscape(query),
		page,
		perPage,
	)

	req, err := http.NewRequestWithContext(c.Request().Context(), "GET", apiURL, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to create request",
		})
	}

	req.Header.Set("Authorization", "Client-ID "+h.accessKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to fetch from Unsplash",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return c.JSON(resp.StatusCode, map[string]string{
			"error": fmt.Sprintf("Unsplash API error: %d", resp.StatusCode),
		})
	}

	var searchResp UnsplashSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to parse Unsplash response",
		})
	}

	// Add UTM parameters to URLs
	for i := range searchResp.Results {
		searchResp.Results[i] = h.addUTMParams(searchResp.Results[i])
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  searchResp.Results,
		"total": searchResp.Total,
	})
}

// TrackDownload handles GET /unsplash/download - triggers download tracking
func (h *UnsplashHandler) TrackDownload(c echo.Context) error {
	downloadLocation := c.QueryParam("download_location")
	if downloadLocation == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "download_location is required",
		})
	}

	req, err := http.NewRequestWithContext(c.Request().Context(), "GET", downloadLocation, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to create request",
		})
	}

	req.Header.Set("Authorization", "Client-ID "+h.accessKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to track download",
		})
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	return c.JSON(http.StatusOK, result)
}

func (h *UnsplashHandler) addUTMParams(photo UnsplashPhoto) UnsplashPhoto {
	if h.utmSource == "" {
		return photo
	}

	utmParams := fmt.Sprintf("utm_source=%s&utm_medium=referral", url.QueryEscape(h.utmSource))

	if photo.Links.HTML != "" {
		photo.Links.HTML = addQueryParams(photo.Links.HTML, utmParams)
	}
	if photo.User.Links.HTML != "" {
		photo.User.Links.HTML = addQueryParams(photo.User.Links.HTML, utmParams)
	}

	return photo
}

func addQueryParams(urlStr, params string) string {
	if urlStr == "" {
		return urlStr
	}
	separator := "?"
	if len(urlStr) > 0 && (urlStr[len(urlStr)-1] == '?' || contains(urlStr, "?")) {
		separator = "&"
	}
	return urlStr + separator + params
}

func contains(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
