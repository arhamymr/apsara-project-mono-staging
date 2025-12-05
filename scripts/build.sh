#!/bin/bash

# ===========================================
# Build Script with Docker Cleanup & Deploy
# ===========================================
# Single command to build, deploy, and expose to internet
#
# Usage: 
#   ./scripts/build.sh                                    # Build all (dev mode)
#   ./scripts/build.sh --prod                             # Build for production
#   ./scripts/build.sh --prod --domain example.com --email admin@example.com  # Full production with SSL
#   ./scripts/build.sh --web                              # Build only web
#   ./scripts/build.sh --backend                          # Build only backend
#   ./scripts/build.sh --mastra                           # Build only mastra
#   ./scripts/build.sh --clean-only                       # Only cleanup

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Default options
BUILD_WEB=true
BUILD_BACKEND=true
BUILD_MASTRA=true
SKIP_CLEANUP=false
CLEAN_ONLY=false
AGGRESSIVE_CLEANUP=false
PRODUCTION=false
DOMAIN=""
EMAIL=""
STAGING=false
START_SERVICES=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --web)
            BUILD_WEB=true
            BUILD_BACKEND=false
            BUILD_MASTRA=false
            shift
            ;;
        --backend)
            BUILD_WEB=false
            BUILD_BACKEND=true
            BUILD_MASTRA=false
            shift
            ;;
        --mastra)
            BUILD_WEB=false
            BUILD_BACKEND=false
            BUILD_MASTRA=true
            shift
            ;;
        --no-cleanup)
            SKIP_CLEANUP=true
            shift
            ;;
        --clean-only)
            CLEAN_ONLY=true
            shift
            ;;
        --aggressive)
            AGGRESSIVE_CLEANUP=true
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
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --staging)
            STAGING=true
            shift
            ;;
        --start|-s)
            START_SERVICES=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Build Options:"
            echo "  --web              Build only web application"
            echo "  --backend          Build only Go backend"
            echo "  --mastra           Build only mastra backend"
            echo "  --no-cleanup       Skip Docker cleanup"
            echo "  --clean-only       Only run cleanup, no build"
            echo "  --aggressive       Aggressive cleanup (remove ALL unused images)"
            echo "  --start, -s        Start services after build"
            echo ""
            echo "Production Options:"
            echo "  --prod             Build for production with nginx"
            echo "  --domain DOMAIN    Domain name for SSL (requires --prod)"
            echo "  --email EMAIL      Email for Let's Encrypt (requires --domain)"
            echo "  --staging          Use Let's Encrypt staging (for testing)"
            echo ""
            echo "Examples:"
            echo "  $0                                          # Dev build"
            echo "  $0 --start                                  # Dev build + start"
            echo "  $0 --prod --start                           # Prod build + start (no SSL)"
            echo "  $0 --prod --domain example.com --email a@b.com  # Full prod with SSL"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

print_header() {
    echo -e "\n${CYAN}=========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}=========================================${NC}"
}

print_step() {
    echo -e "\n${YELLOW}→ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

show_disk_usage() {
    echo -e "\n${BLUE}Docker disk usage:${NC}"
    docker system df 2>/dev/null || echo "Could not get disk usage"
}

cleanup_docker() {
    local aggressive=$1
    
    print_header "Cleaning Docker Artifacts"
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
    
    echo -e "\n${GREEN}After cleanup:${NC}"
    show_disk_usage
    print_success "Docker cleanup complete!"
}

setup_ssl() {
    print_header "Setting up SSL Certificate"
    
    mkdir -p certbot/www certbot/conf
    
    # Create temporary nginx config
    print_step "Creating temporary nginx for verification..."
    cat > nginx/nginx-init.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 200 'Setting up SSL...';
        add_header Content-Type text/plain;
    }
}
EOF

    # Start temporary nginx
    docker run -d --name nginx-init \
        -p 80:80 \
        -v "$PROJECT_DIR/nginx/nginx-init.conf:/etc/nginx/conf.d/default.conf:ro" \
        -v "$PROJECT_DIR/certbot/www:/var/www/certbot" \
        nginx:alpine
    
    sleep 3
    
    # Get certificate
    print_step "Obtaining SSL certificate..."
    STAGING_ARG=""
    if [ "$STAGING" == true ]; then
        STAGING_ARG="--staging"
        echo -e "${YELLOW}Using staging environment${NC}"
    fi
    
    docker run --rm \
        -v "$PROJECT_DIR/certbot/www:/var/www/certbot" \
        -v "$PROJECT_DIR/certbot/conf:/etc/letsencrypt" \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        $STAGING_ARG
    
    # Cleanup
    docker stop nginx-init && docker rm nginx-init
    rm -f nginx/nginx-init.conf
    
    print_success "SSL certificate obtained!"
}

# Main script
print_header "Build Script Started"
echo -e "${BLUE}Project: ${PROJECT_DIR}${NC}"
echo -e "${BLUE}Mode: $([ "$PRODUCTION" == true ] && echo "Production" || echo "Development")${NC}"
echo -e "${BLUE}Time: $(date)${NC}"

cd "$PROJECT_DIR"

# Check Docker
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

# Determine compose file
if [ "$PRODUCTION" == true ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

# SSL setup if domain provided
if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
    export DOMAIN="$DOMAIN"
    
    # Update .env
    if ! grep -q "^DOMAIN=" .env 2>/dev/null; then
        echo "DOMAIN=$DOMAIN" >> .env
    else
        sed -i "s/^DOMAIN=.*/DOMAIN=$DOMAIN/" .env
    fi
    
    # Check if certificate exists
    if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
        setup_ssl
    else
        print_step "SSL certificate already exists for $DOMAIN"
    fi
fi

# Build phase
print_header "Building Docker Images"

SERVICES_TO_BUILD=""
[ "$BUILD_WEB" == true ] && SERVICES_TO_BUILD="$SERVICES_TO_BUILD web"
[ "$BUILD_BACKEND" == true ] && SERVICES_TO_BUILD="$SERVICES_TO_BUILD backend"
[ "$BUILD_MASTRA" == true ] && SERVICES_TO_BUILD="$SERVICES_TO_BUILD mastra"
SERVICES_TO_BUILD=$(echo "$SERVICES_TO_BUILD" | xargs)

if [ -n "$SERVICES_TO_BUILD" ]; then
    print_step "Building services: $SERVICES_TO_BUILD"
    docker-compose -f "$COMPOSE_FILE" build --no-cache $SERVICES_TO_BUILD
else
    print_step "No services selected to build"
fi

print_success "Build complete!"

# Post-build cleanup
if [ "$SKIP_CLEANUP" == false ]; then
    print_step "Post-build cleanup..."
    docker image prune -f 2>/dev/null || true
fi

# Start services if requested or if domain is set (production deploy)
if [ "$START_SERVICES" == true ] || [ -n "$DOMAIN" ]; then
    print_header "Starting Services"
    docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_step "Waiting for services..."
    sleep 10
    
    print_step "Service status:"
    docker-compose -f "$COMPOSE_FILE" ps
fi

# Final summary
print_header "Build Complete!"
show_disk_usage

if [ -n "$DOMAIN" ]; then
    echo -e "\n${GREEN}Application is live at:${NC}"
    echo -e "  ${BLUE}https://$DOMAIN${NC}"
    echo -e "\n${YELLOW}API Endpoints:${NC}"
    echo -e "  ${BLUE}Backend: https://$DOMAIN/api/${NC}"
    echo -e "  ${BLUE}Mastra:  https://$DOMAIN/mastra/${NC}"
    echo -e "\n${YELLOW}Commands:${NC}"
    echo -e "  ${BLUE}Logs:    docker-compose -f docker-compose.prod.yml logs -f${NC}"
    echo -e "  ${BLUE}Restart: docker-compose -f docker-compose.prod.yml restart${NC}"
else
    echo -e "\n${BLUE}Next steps:${NC}"
    if [ "$START_SERVICES" != true ]; then
        echo -e "  • Run ${YELLOW}docker-compose up -d${NC} to start"
    fi
    echo -e "  • Run ${YELLOW}$0 --prod --domain example.com --email you@email.com${NC} for production"
    echo -e "\n${BLUE}Services (dev):${NC}"
    echo -e "  • Web:     http://localhost:\${WEB_PORT:-3000}"
    echo -e "  • Backend: http://localhost:\${BACKEND_PORT:-8080}"
    echo -e "  • Mastra:  http://localhost:\${MASTRA_PORT:-4111}"
fi
