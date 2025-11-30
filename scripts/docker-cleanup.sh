#!/bin/bash

# ===========================================
# Docker Cleanup Script for VPS Storage Management
# ===========================================
# This script removes unused Docker resources to free up disk space
# Usage: ./scripts/docker-cleanup.sh [--aggressive]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Docker Cleanup Script${NC}"
echo -e "${GREEN}=========================================${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Show current disk usage
echo -e "\n${YELLOW}Current Docker disk usage:${NC}"
docker system df

# Parse arguments
AGGRESSIVE=false
if [ "$1" == "--aggressive" ]; then
    AGGRESSIVE=true
    echo -e "\n${YELLOW}Running in AGGRESSIVE mode - will remove ALL unused images${NC}"
fi

# Remove stopped containers
echo -e "\n${YELLOW}Removing stopped containers...${NC}"
docker container prune -f

# Remove dangling images (untagged images)
echo -e "\n${YELLOW}Removing dangling images...${NC}"
docker image prune -f

# Aggressive mode: remove all unused images
if [ "$AGGRESSIVE" == true ]; then
    echo -e "\n${YELLOW}Removing ALL unused images...${NC}"
    docker image prune -a -f
fi


# Remove unused volumes
echo -e "\n${YELLOW}Removing unused volumes...${NC}"
docker volume prune -f

# Remove unused networks
echo -e "\n${YELLOW}Removing unused networks...${NC}"
docker network prune -f

# Remove build cache
echo -e "\n${YELLOW}Removing build cache...${NC}"
docker builder prune -f

# Show disk usage after cleanup
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Cleanup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "\n${YELLOW}Docker disk usage after cleanup:${NC}"
docker system df

echo -e "\n${GREEN}Done! VPS storage has been cleaned up.${NC}"
echo -e "${YELLOW}Tip: Run with --aggressive flag to remove ALL unused images${NC}"
