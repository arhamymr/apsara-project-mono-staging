#!/bin/bash

# Simple health check
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

check() {
    local name=$1
    local url=$2
    if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name - healthy"
        return 0
    else
        echo -e "${RED}✗${NC} $name - unhealthy"
        return 1
    fi
}

echo "Health Check"
echo "============"
check "web" "http://localhost/api/health"
check "backend" "http://localhost:8080/health"
