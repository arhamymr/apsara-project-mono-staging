#!/bin/bash

# Docker cleanup script
set -e

echo "Docker Cleanup"
echo "=============="

docker system df
echo ""

echo "Removing stopped containers..."
docker container prune -f

echo "Removing dangling images..."
docker image prune -f

echo "Removing unused volumes..."
docker volume prune -f

echo "Removing unused networks..."
docker network prune -f

echo "Removing build cache..."
docker builder prune -f

echo ""
echo "After cleanup:"
docker system df
