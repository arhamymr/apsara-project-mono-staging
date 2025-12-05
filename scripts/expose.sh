#!/bin/bash

# ===========================================
# Expose Script - Deploy with SSL & Domain
# ===========================================
# This script sets up the application with:
# - Nginx reverse proxy
# - Let's Encrypt SSL certificates
# - Domain configuration
#
# Usage:
#   ./scripts/expose.sh --domain example.com --email admin@example.com
#   ./scripts/expose.sh --domain example.com --email admin@example.com --staging
#   ./scripts/expose.sh --renew

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

# Default values
DOMAIN=""
EMAIL=""
STAGING=false
RENEW_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
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
        --renew)
            RENEW_ONLY=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --domain DOMAIN    Your domain name (required)"
            echo "  --email EMAIL      Email for Let's Encrypt (required)"
            echo "  --staging          Use Let's Encrypt staging (for testing)"
            echo "  --renew            Only renew existing certificates"
            echo "  --help, -h         Show this help message"
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

cd "$PROJECT_DIR"

# Renew only mode
if [ "$RENEW_ONLY" == true ]; then
    print_header "Renewing SSL Certificates"
    docker-compose -f docker-compose.prod.yml run --rm certbot renew
    docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
    print_success "Certificates renewed!"
    exit 0
fi

# Validate required arguments
if [ -z "$DOMAIN" ]; then
    print_error "Domain is required. Use --domain example.com"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    print_error "Email is required. Use --email admin@example.com"
    exit 1
fi

print_header "Exposing Application to Internet"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}Email: ${EMAIL}${NC}"
echo -e "${BLUE}Staging: ${STAGING}${NC}"

# Create directories
print_step "Creating certificate directories..."
mkdir -p certbot/www certbot/conf

# Export domain for docker-compose
export DOMAIN="$DOMAIN"

# Update .env with domain
if ! grep -q "^DOMAIN=" .env 2>/dev/null; then
    echo "DOMAIN=$DOMAIN" >> .env
else
    sed -i "s/^DOMAIN=.*/DOMAIN=$DOMAIN/" .env
fi

# Step 1: Create temporary nginx config for initial certificate
print_step "Creating temporary nginx config..."
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

# Step 2: Start nginx with temporary config
print_step "Starting nginx for certificate verification..."
docker run -d --name nginx-init \
    -p 80:80 \
    -v "$PROJECT_DIR/nginx/nginx-init.conf:/etc/nginx/conf.d/default.conf:ro" \
    -v "$PROJECT_DIR/certbot/www:/var/www/certbot" \
    nginx:alpine

sleep 3

# Step 3: Get SSL certificate
print_step "Obtaining SSL certificate from Let's Encrypt..."

STAGING_ARG=""
if [ "$STAGING" == true ]; then
    STAGING_ARG="--staging"
    echo -e "${YELLOW}Using staging environment (certificates won't be trusted)${NC}"
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

# Step 4: Stop temporary nginx
print_step "Stopping temporary nginx..."
docker stop nginx-init && docker rm nginx-init

# Step 5: Clean up temporary config
rm -f nginx/nginx-init.conf

# Step 6: Run cleanup before building
print_step "Cleaning up old Docker artifacts..."
"$SCRIPT_DIR/docker-cleanup.sh" || true

# Step 7: Build and start with production config
print_step "Building and starting production services..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
print_step "Waiting for services to start..."
sleep 15

# Check status
print_step "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

print_header "Deployment Complete!"
echo -e "${GREEN}Your application is now accessible at:${NC}"
echo -e "${BLUE}  https://$DOMAIN${NC}"
echo -e "${BLUE}  https://www.$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}API Endpoints:${NC}"
echo -e "${BLUE}  Backend: https://$DOMAIN/api/${NC}"
echo -e "${BLUE}  Mastra:  https://$DOMAIN/mastra/${NC}"
echo ""
echo -e "${YELLOW}To renew certificates:${NC}"
echo -e "${BLUE}  ./scripts/expose.sh --renew${NC}"
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo -e "${BLUE}  docker-compose -f docker-compose.prod.yml logs -f${NC}"
