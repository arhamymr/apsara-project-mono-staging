#!/bin/bash

# ===========================================
# Health Check Script for All Services
# ===========================================
# Monitors health of all services and reports status
#
# Usage:
#   ./scripts/healthcheck.sh              # Check all services
#   ./scripts/healthcheck.sh --watch      # Continuous monitoring
#   ./scripts/healthcheck.sh --json       # Output as JSON
#   ./scripts/healthcheck.sh --prod       # Check production endpoints

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default configuration
WATCH_MODE=false
JSON_OUTPUT=false
PRODUCTION=false
WATCH_INTERVAL=10

# Service endpoints (development)
WEB_URL="http://localhost:${WEB_PORT:-3000}"
BACKEND_URL="http://localhost:${BACKEND_PORT:-8080}"
MASTRA_URL="http://localhost:${MASTRA_PORT:-4111}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --watch|-w)
            WATCH_MODE=true
            shift
            ;;
        --json|-j)
            JSON_OUTPUT=true
            shift
            ;;
        --prod|--production)
            PRODUCTION=true
            shift
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --interval)
            WATCH_INTERVAL="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --watch, -w       Continuous monitoring mode"
            echo "  --json, -j        Output results as JSON"
            echo "  --prod            Check production endpoints"
            echo "  --domain DOMAIN   Domain for production checks"
            echo "  --interval SECS   Watch interval (default: 10)"
            echo "  --help, -h        Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Update URLs for production
if [ "$PRODUCTION" == true ]; then
    if [ -z "$DOMAIN" ]; then
        # Try to get domain from .env
        if [ -f ".env" ]; then
            DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
        fi
    fi
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}Error: Domain required for production mode. Use --domain${NC}"
        exit 1
    fi
    
    WEB_URL="https://$DOMAIN"
    BACKEND_URL="https://$DOMAIN/api"
    MASTRA_URL="https://$DOMAIN/mastra"
fi

# Function to check service health
check_service() {
    local name=$1
    local url=$2
    local endpoint=$3
    local start_time=$(date +%s%N)
    
    local response
    local http_code
    local body
    
    # Make request with timeout
    response=$(curl -s -w "\n%{http_code}" --connect-timeout 5 --max-time 10 "${url}${endpoint}" 2>/dev/null) || true
    
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))
    
    # Extract body and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    local status="unhealthy"
    local message="Connection failed"
    
    if [ -n "$http_code" ] && [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        status="healthy"
        message="OK"
    elif [ -n "$http_code" ] && [ "$http_code" != "000" ]; then
        message="HTTP $http_code"
    fi
    
    if [ "$JSON_OUTPUT" == true ]; then
        echo "{\"service\":\"$name\",\"status\":\"$status\",\"url\":\"${url}${endpoint}\",\"http_code\":\"$http_code\",\"response_time_ms\":$duration,\"message\":\"$message\"}"
    else
        if [ "$status" == "healthy" ]; then
            echo -e "${GREEN}✓${NC} ${CYAN}$name${NC} - ${GREEN}$status${NC} (${duration}ms)"
        else
            echo -e "${RED}✗${NC} ${CYAN}$name${NC} - ${RED}$status${NC} - $message"
        fi
    fi
    
    # Return exit code based on status
    [ "$status" == "healthy" ]
}

# Function to run all health checks
run_health_checks() {
    local all_healthy=true
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    if [ "$JSON_OUTPUT" == true ]; then
        echo "{"
        echo "  \"timestamp\": \"$timestamp\","
        echo "  \"mode\": \"$([ "$PRODUCTION" == true ] && echo "production" || echo "development")\","
        echo "  \"services\": ["
    else
        echo -e "\n${CYAN}=========================================${NC}"
        echo -e "${CYAN}Health Check - $(date)${NC}"
        echo -e "${CYAN}Mode: $([ "$PRODUCTION" == true ] && echo "Production" || echo "Development")${NC}"
        echo -e "${CYAN}=========================================${NC}\n"
    fi
    
    # Check Web
    if [ "$JSON_OUTPUT" == true ]; then
        echo -n "    "
        check_service "web" "$WEB_URL" "/api/health" || all_healthy=false
        echo ","
    else
        check_service "web" "$WEB_URL" "/api/health" || all_healthy=false
    fi
    
    # Check Backend
    if [ "$JSON_OUTPUT" == true ]; then
        echo -n "    "
        check_service "backend" "$BACKEND_URL" "/health" || all_healthy=false
        echo ","
    else
        check_service "backend" "$BACKEND_URL" "/health" || all_healthy=false
    fi
    
    # Check Mastra
    if [ "$JSON_OUTPUT" == true ]; then
        echo -n "    "
        check_service "mastra" "$MASTRA_URL" "/" || all_healthy=false
        echo ""
    else
        check_service "mastra" "$MASTRA_URL" "/" || all_healthy=false
    fi
    
    if [ "$JSON_OUTPUT" == true ]; then
        echo "  ],"
        echo "  \"all_healthy\": $all_healthy"
        echo "}"
    else
        echo ""
        if [ "$all_healthy" == true ]; then
            echo -e "${GREEN}All services are healthy!${NC}"
        else
            echo -e "${RED}Some services are unhealthy!${NC}"
        fi
    fi
    
    $all_healthy
}

# Main execution
if [ "$WATCH_MODE" == true ]; then
    echo -e "${YELLOW}Starting continuous health monitoring (interval: ${WATCH_INTERVAL}s)${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    
    while true; do
        clear
        run_health_checks || true
        echo -e "\n${BLUE}Next check in ${WATCH_INTERVAL}s...${NC}"
        sleep "$WATCH_INTERVAL"
    done
else
    run_health_checks
fi
