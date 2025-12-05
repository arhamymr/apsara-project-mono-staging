#!/bin/bash

# ===========================================
# Simple Build & Deploy Script
# ===========================================
# Usage: 
#   ./scripts/build.sh           # Build all
#   ./scripts/build.sh --web     # Build only web
#   ./scripts/build.sh --backend # Build only backend
#   ./scripts/build.sh --start   # Build and start

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BUILD_WEB=true
BUILD_BACKEND=true
START_SERVICES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --web)
            BUILD_WEB=true
            BUILD_BACKEND=false
            shift
            ;;
        --backend)
            BUILD_WEB=false
            BUILD_BACKEND=true
            shift
            ;;
        --start|-s)
            START_SERVICES=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo "  --web       Build only web"
            echo "  --backend   Build only backend"
            echo "  --start     Start services after build"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running!${NC}"
    exit 1
fi

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
docker image prune -f 2>/dev/null || true

# Build
SERVICES=""
[ "$BUILD_WEB" == true ] && SERVICES="$SERVICES web"
[ "$BUILD_BACKEND" == true ] && SERVICES="$SERVICES backend"
SERVICES=$(echo "$SERVICES" | xargs)

if [ -n "$SERVICES" ]; then
    echo -e "${YELLOW}Building: $SERVICES${NC}"
    docker-compose build --no-cache $SERVICES
fi

# Start if requested
if [ "$START_SERVICES" == true ]; then
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose up -d
    sleep 5
    docker-compose ps
fi

echo -e "${GREEN}Done!${NC}"
echo -e "Web: http://localhost (port 80)"
echo -e "Backend: http://localhost:8080"
