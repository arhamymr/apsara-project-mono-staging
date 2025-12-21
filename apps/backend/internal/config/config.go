package config

import (
	"os"
	"strings"
)

type Config struct {
	LivekitHost   string
	LivekitAPIKey string
	LivekitSecret string
	Port          string
	CORSOrigins   []string
	// R2 Configuration
	R2AccessKeyID     string
	R2SecretAccessKey string
	R2Bucket          string
	R2Endpoint        string
	R2PublicBase      string
	// Unsplash Configuration
	UnsplashAccessKey string
	UnsplashUTMSource string
	// Convex Configuration
	ConvexURL string
}

func Load() *Config {
	corsOrigins := []string{"http://localhost:1234", "http://127.0.0.1:1234"}
	if customOrigins := getEnv("CORS_ORIGINS", ""); customOrigins != "" {
		corsOrigins = strings.Split(customOrigins, ",")
		for i := range corsOrigins {
			corsOrigins[i] = strings.TrimSpace(corsOrigins[i])
		}
	}

	return &Config{
		LivekitHost:       getEnv("LIVEKIT_URL", "https://your-project.livekit.cloud"),
		LivekitAPIKey:     getEnv("LIVEKIT_API_KEY", ""),
		LivekitSecret:     getEnv("LIVEKIT_API_SECRET", ""),
		Port:              getEnv("PORT", ":1323"),
		CORSOrigins:       corsOrigins,
		R2AccessKeyID:     getEnv("R2_ACCESS_KEY_ID", ""),
		R2SecretAccessKey: getEnv("R2_SECRET_ACCESS_KEY", ""),
		R2Bucket:          getEnv("R2_BUCKET", ""),
		R2Endpoint:        getEnv("R2_ENDPOINT", ""),
		R2PublicBase:      getEnv("R2_PUBLIC_BASE", ""),
		UnsplashAccessKey: getEnv("UNSPLASH_ACCESS_KEY", ""),
		UnsplashUTMSource: getEnv("UNSPLASH_UTM_SOURCE", ""),
		ConvexURL:         getEnv("CONVEX_URL", ""),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
