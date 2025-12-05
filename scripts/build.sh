#!/bin/bash

# ===========================================
# Build Script with Docker Cleanup
# ===========================================
# This script handles building the project with automatic
# cleanup of unused Docker artifacts before/after build.
#
# Usage: 
#   ./scripts/build.sh              # Full build with cleanup
#   ./scripts/build.sh --web        # Build only web app
#   ./scripts/build.sh --mastra     # Build only mastra
#   ./scripts/build.sh --no-cleanup # Skip cleanup step
#   ./scripts/build.sh --clean-only # Only run cleanup, no build

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Default options
BUILD_WEB=true
BUILD_MASTRA=true
SKIP_CLEANUP=false
CLEAN_ONLY=false
AGGRESSIVE_CLEANUP=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --web)
            BUILD_WEB=true
            BUILD_MASTRA=false
            ;;
        --mastra)
            BUILD_WEB=false
            BUILD_MASTRA=true
            ;;
        --no-cleanup)
            SKIP_CLEANUP=true
            ;;
        --clean-only)
            CLEAN_ONLY=true
            ;;
        --aggressive)
            AGGRESSIVE_CLEANUP=true
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --web          Build only web application"
            echo "  --mastra       Build only mastra backend"
            echo "  --no-cleanup   Skip Docker cleanup"
            echo "  --clean-only   Only run cleanup, no build"
            echo "  --aggressive   Aggressive cleanup (remove ALL unused images)"
            echo "  --help, -h     Show this help message"
            exit 0
            ;;
    esac
done

# Function to print section header
print_header() {
    echo -e "\n${CYAN}=========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}=========================================${NC}"
}

# Function to print step
print_step() {
    echo -e "\n${YELLOW}→ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to show disk usage
show_disk_usage() {
    echo -e "\n${BLUE}Docker disk usage:${NC}"
    docker system df 2>/dev/null || echo "Could not get disk usage"
}

# Function to cleanup Docker artifacts
cleanup_docker() {
    local aggressive=$1
    
    print_header "Cleaning Docker Artifacts"
    
    # Show disk usage before cleanup
    show_disk_usage
    
    print_step "Removing stopped containers..."
    docker container prune -f 2>/dev/null || true
    
    print_step "Removing dangling images..."
    docker image prune -f 2>/dev/null || true
    
    if [ "$aggressive" == true ]; then
        print_step "Removing ALL unused images (aggressive mode)..."
        docker image prune -a -f 2>/dev/null || true
    fi
    
    print_step "Removing unused volumes..."
    docker volume prune -f 2>/dev/null || true
    
    print_step "Removing unused networks..."
    docker network prune -f 2>/dev/null || true
    
    print_step "Removing build cache..."
    docker builder prune -f 2>/dev/null || true
    
    # Show disk usage after cleanup
    echo -e "\n${GREEN}After cleanup:${NC}"
    show_disk_usage
    
    print_success "Docker cleanup complete!"
}

# Main script
print_header "Build Script Started"
echo -e "${BLUE}Project: ${PROJECT_DIR}${NC}"
echo -e "${BLUE}Time: $(date)${NC}"

cd "$PROJECT_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running!"
    exit 1
fi

# Clean only mode
if [ "$CLEAN_ONLY" == true ]; then
    cleanup_docker $AGGRESSIVE_CLEANUP
    print_header "Cleanup Complete!"
    exit 0
fi

# Pre-build cleanup
if [ "$SKIP_CLEANUP" == false ]; then
    cleanup_docker $AGGRESSIVE_CLEANUP
fi

# Build phase
print_header "Building Docker Images"

# Build services
if [ "$BUILD_WEB" == true ] && [ "$BUILD_MASTRA" == true ]; then
    print_step "Building all services..."
    docker-compose build --no-cache
elif [ "$BUILD_WEB" == true ]; then
    print_step "Building web service..."
    docker-compose build --no-cache web
elif [ "$BUILD_MASTRA" == true ]; then
    print_step "Building mastra service..."
    docker-compose build --no-cache mastra
fi

print_success "Build complete!"

# Post-build cleanup (remove dangling images from build)
if [ "$SKIP_CLEANUP" == false ]; then
    print_step "Post-build cleanup (removing dangling images)..."
    docker image prune -f 2>/dev/null || true
fi

# Final summary
print_header "Build Summary"
echo -e "${GREEN}✓ Build completed successfully!${NC}"
show_disk_usage

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "  • Run ${YELLOW}docker-compose up -d${NC} to start containers"
echo -e "  • Run ${YELLOW}./scripts/deploy.sh${NC} for full deployment"
echo -e "  • Run ${YELLOW}docker-compose ps${NC} to check status"
