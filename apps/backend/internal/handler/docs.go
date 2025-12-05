package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// SwaggerUIHandler serves the Swagger UI
func SwaggerUIHandler(c echo.Context) error {
	return c.HTML(http.StatusOK, swaggerUIHTML)
}

// SwaggerJSONHandler serves the OpenAPI spec
func SwaggerJSONHandler(c echo.Context) error {
	return c.File("docs/swagger.json")
}

const swaggerUIHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiveKit API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        body { margin: 0; padding: 0; }
        .swagger-ui .topbar { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function() {
            SwaggerUIBundle({
                url: "/swagger.json",
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
                layout: "BaseLayout",
                deepLinking: true,
                showExtensions: true,
                showCommonExtensions: true
            });
        };
    </script>
</body>
</html>`
