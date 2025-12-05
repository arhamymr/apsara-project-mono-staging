package config

import "os"

type Config struct {
	LivekitHost   string
	LivekitAPIKey string
	LivekitSecret string
	Port          string
}

func Load() *Config {
	return &Config{
		LivekitHost:   getEnv("LIVEKIT_URL", "https://your-project.livekit.cloud"),
		LivekitAPIKey: getEnv("LIVEKIT_API_KEY", ""),
		LivekitSecret: getEnv("LIVEKIT_API_SECRET", ""),
		Port:          getEnv("PORT", ":1323"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
