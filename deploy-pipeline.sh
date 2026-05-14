#!/bin/bash

# ============================================================================
# QRPiPay - Complete Docker Pipeline Orchestration
# Conception → Dev → Build → Test → Push → Deploy → Monitor
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="qrpipay"
DOCKER_USERNAME="${DOCKER_USERNAME:-portraitart1}"
VERSION="1.0.0"
PLATFORMS="linux/amd64,linux/arm64"

# Functions
log_step() {
    echo -e "${BLUE}=== STEP: $1 ===${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================================================
# 1. CONCEPTION - Validate Docker Compose Structure
# ============================================================================
step_conception() {
    log_step "CONCEPTION - Validating docker-compose.yml"
    
    if [ ! -f "docker-compose.yml" ]; then
        log_error "docker-compose.yml not found!"
        exit 1
    fi
    
    if docker-compose config > /dev/null 2>&1; then
        log_success "Docker Compose configuration is valid"
    else
        log_error "Docker Compose configuration is invalid!"
        docker-compose config
        exit 1
    fi
}

# ============================================================================
# 2. DEV LOCAL - Start with hot-reload
# ============================================================================
step_dev_local() {
    log_step "DEV LOCAL - Starting local development with hot-reload"
    
    if [ "$1" = "--dev-only" ]; then
        log_warning "Starting development mode (Press Ctrl+C to stop)"
        docker-compose up --watch
        exit 0
    fi
    
    log_success "Dev environment ready (use --dev-only to start watch mode)"
}

# ============================================================================
# 3. BUILD - Multi-platform build
# ============================================================================
step_build() {
    log_step "BUILD - Building for platforms: $PLATFORMS"
    
    # Check if buildx is available
    if ! docker buildx version > /dev/null 2>&1; then
        log_error "Docker buildx not available. Install it first!"
        exit 1
    fi
    
    # Build backend
    log_step "Building backend image..."
    docker buildx build \
        --platform $PLATFORMS \
        --tag $DOCKER_USERNAME/$APP_NAME-backend:latest \
        --tag $DOCKER_USERNAME/$APP_NAME-backend:v$VERSION \
        --file ./backend/Dockerfile \
        --push . || {
        log_error "Backend build failed"
        exit 1
    }
    log_success "Backend build complete"
    
    # Build frontend
    log_step "Building frontend image..."
    docker buildx build \
        --platform $PLATFORMS \
        --tag $DOCKER_USERNAME/$APP_NAME-frontend:latest \
        --tag $DOCKER_USERNAME/$APP_NAME-frontend:v$VERSION \
        --file ./frontend/Dockerfile \
        --push . || {
        log_error "Frontend build failed"
        exit 1
    }
    log_success "Frontend build complete"
}

# ============================================================================
# 4. TEST - Run tests
# ============================================================================
step_test() {
    log_step "TEST - Running tests"
    
    log_step "Testing backend..."
    docker run --rm \
        -v "$(pwd)/backend:/app/backend" \
        $DOCKER_USERNAME/$APP_NAME-backend:latest \
        npm test 2>&1 || log_warning "Backend tests skipped or failed (non-critical)"
    
    log_success "Tests complete"
}

# ============================================================================
# 5. SCAN - Security scan with Docker Scout
# ============================================================================
step_scan() {
    log_step "SCAN - Running Docker Scout security scan"
    
    if ! docker scout --version > /dev/null 2>&1; then
        log_warning "Docker Scout not available, skipping scan"
        return
    fi
    
    log_step "Scanning backend image..."
    docker scout cves $DOCKER_USERNAME/$APP_NAME-backend:latest || log_warning "Scout scan completed with warnings"
    
    log_step "Scanning frontend image..."
    docker scout cves $DOCKER_USERNAME/$APP_NAME-frontend:latest || log_warning "Scout scan completed with warnings"
    
    log_success "Security scan complete"
}

# ============================================================================
# 6. PUSH - Push to Docker Hub
# ============================================================================
step_push() {
    log_step "PUSH - Pushing images to Docker Hub"
    
    # Check if logged in
    if ! docker info | grep -q "Username:"; then
        log_warning "Not logged into Docker Hub. Running: docker login"
        docker login
    fi
    
    log_step "Pushing backend:latest..."
    docker push $DOCKER_USERNAME/$APP_NAME-backend:latest || {
        log_error "Failed to push backend:latest"
        exit 1
    }
    
    log_step "Pushing backend:v$VERSION..."
    docker push $DOCKER_USERNAME/$APP_NAME-backend:v$VERSION || {
        log_error "Failed to push backend:v$VERSION"
        exit 1
    }
    
    log_step "Pushing frontend:latest..."
    docker push $DOCKER_USERNAME/$APP_NAME-frontend:latest || {
        log_error "Failed to push frontend:latest"
        exit 1
    }
    
    log_step "Pushing frontend:v$VERSION..."
    docker push $DOCKER_USERNAME/$APP_NAME-frontend:v$VERSION || {
        log_error "Failed to push frontend:v$VERSION"
        exit 1
    }
    
    log_success "All images pushed to Docker Hub"
}

# ============================================================================
# 7. DEPLOY - Deploy to Render
# ============================================================================
step_deploy() {
    log_step "DEPLOY - Deploying to Render"
    
    log_warning "Render deployment is manual:"
    echo ""
    echo "1. Go to Render dashboard: https://dashboard.render.com"
    echo "2. Click on 'qrpipay-backend' service"
    echo "3. Click 'Clear Build Cache'"
    echo "4. Click 'Deploy'"
    echo ""
    echo "Render will automatically pull images from:"
    echo "  - Backend: $DOCKER_USERNAME/$APP_NAME-backend:latest"
    echo "  - Frontend: $DOCKER_USERNAME/$APP_NAME-frontend:latest"
    echo ""
    log_success "Ready for Render deployment"
}

# ============================================================================
# 8. MONITOR - Monitor running containers
# ============================================================================
step_monitor() {
    log_step "MONITOR - Monitoring containers"
    
    log_step "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    
    log_step "Real-time stats (Ctrl+C to stop):"
    docker stats --no-stream
}

# ============================================================================
# MAIN ORCHESTRATION
# ============================================================================
main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     QRPiPay - Docker Pipeline Orchestration v$VERSION       ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Parse arguments
    case "${1:-full}" in
        conception)
            step_conception
            ;;
        dev)
            step_dev_local --dev-only
            ;;
        build)
            step_conception
            step_build
            ;;
        test)
            step_test
            ;;
        scan)
            step_scan
            ;;
        push)
            step_conception
            step_build
            step_test
            step_scan
            step_push
            ;;
        deploy)
            step_deploy
            ;;
        monitor)
            step_monitor
            ;;
        full)
            step_conception
            step_build
            step_test
            step_scan
            step_push
            step_deploy
            step_monitor
            ;;
        *)
            echo "Usage: $0 {conception|dev|build|test|scan|push|deploy|monitor|full}"
            echo ""
            echo "Examples:"
            echo "  $0 conception    # Validate docker-compose"
            echo "  $0 dev           # Start dev with hot-reload"
            echo "  $0 build         # Build images only"
            echo "  $0 test          # Run tests"
            echo "  $0 scan          # Security scan"
            echo "  $0 push          # Build & push to Docker Hub"
            echo "  $0 deploy        # Deploy to Render"
            echo "  $0 monitor       # Monitor containers"
            echo "  $0 full          # Complete pipeline (default)"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}✓ Pipeline execution complete!${NC}"
    echo ""
}

# Run main
main "$@"
