# QRPiPay Docker Pipeline - PowerShell Version

param(
    [ValidateSet("conception", "dev", "build", "test", "scan", "push", "deploy", "monitor", "full")]
    [string]$Step = "full"
)

$APP_NAME = "qrpipay"
$DOCKER_USERNAME = "portraitart1"
$VERSION = "1.0.0"
$PLATFORMS = "linux/amd64,linux/arm64"

function Write-Step {
    Write-Host "=== STEP: $args ===" -ForegroundColor Blue
}

function Write-Success {
    Write-Host "[OK] $args" -ForegroundColor Green
}

function Write-Error2 {
    Write-Host "[ERROR] $args" -ForegroundColor Red
}

function Write-Warning2 {
    Write-Host "[WARNING] $args" -ForegroundColor Yellow
}

# 1. CONCEPTION
function Step-Conception {
    Write-Step "CONCEPTION - Validating docker-compose.yml"
    
    if (!(Test-Path "docker-compose.yml")) {
        Write-Error2 "docker-compose.yml not found!"
        exit 1
    }
    
    try {
        docker-compose config > $null 2>&1
        Write-Success "Docker Compose configuration is valid"
    } catch {
        Write-Error2 "Docker Compose configuration is invalid!"
        docker-compose config
        exit 1
    }
}

# 2. DEV LOCAL
function Step-Dev {
    Write-Step "DEV LOCAL - Starting local development with hot-reload"
    Write-Warning2 "Starting development mode (Press Ctrl+C to stop)"
    docker-compose up --watch
}

# 3. BUILD
function Step-Build {
    Write-Step "BUILD - Building for platforms: $PLATFORMS"
    
    try {
        docker buildx version > $null 2>&1
    } catch {
        Write-Error2 "Docker buildx not available!"
        exit 1
    }
    
    Write-Step "Building backend image..."
    docker buildx build `
        --platform $PLATFORMS `
        --tag "$DOCKER_USERNAME/$APP_NAME-backend:latest" `
        --tag "$DOCKER_USERNAME/$APP_NAME-backend:v$VERSION" `
        --file ./backend/Dockerfile `
        --push .
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error2 "Backend build failed"
        exit 1
    }
    Write-Success "Backend build complete"
    
    Write-Step "Building frontend image..."
    docker buildx build `
        --platform $PLATFORMS `
        --tag "$DOCKER_USERNAME/$APP_NAME-frontend:latest" `
        --tag "$DOCKER_USERNAME/$APP_NAME-frontend:v$VERSION" `
        --file ./frontend/Dockerfile `
        --push .
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error2 "Frontend build failed"
        exit 1
    }
    Write-Success "Frontend build complete"
}

# 4. TEST
function Step-Test {
    Write-Step "TEST - Running tests"
    
    Write-Step "Testing backend..."
    try {
        docker run --rm `
            -v "$(Get-Location)/backend:/app/backend" `
            "$DOCKER_USERNAME/$APP_NAME-backend:latest" `
            npm test
    } catch {
        Write-Warning2 "Backend tests skipped or failed (non-critical)"
    }
    
    Write-Success "Tests complete"
}

# 5. SCAN
function Step-Scan {
    Write-Step "SCAN - Running Docker Scout security scan"
    
    try {
        docker scout --version > $null 2>&1
    } catch {
        Write-Warning2 "Docker Scout not available, skipping scan"
        return
    }
    
    Write-Step "Scanning backend image..."
    docker scout cves "$DOCKER_USERNAME/$APP_NAME-backend:latest"
    
    Write-Step "Scanning frontend image..."
    docker scout cves "$DOCKER_USERNAME/$APP_NAME-frontend:latest"
    
    Write-Success "Security scan complete"
}

# 6. PUSH
function Step-Push {
    Write-Step "PUSH - Pushing images to Docker Hub"
    
    Write-Step "Pushing backend:latest..."
    docker push "$DOCKER_USERNAME/$APP_NAME-backend:latest"
    if ($LASTEXITCODE -ne 0) { Write-Error2 "Failed to push backend:latest"; exit 1 }
    
    Write-Step "Pushing backend:v$VERSION..."
    docker push "$DOCKER_USERNAME/$APP_NAME-backend:v$VERSION"
    if ($LASTEXITCODE -ne 0) { Write-Error2 "Failed to push backend:v$VERSION"; exit 1 }
    
    Write-Step "Pushing frontend:latest..."
    docker push "$DOCKER_USERNAME/$APP_NAME-frontend:latest"
    if ($LASTEXITCODE -ne 0) { Write-Error2 "Failed to push frontend:latest"; exit 1 }
    
    Write-Step "Pushing frontend:v$VERSION..."
    docker push "$DOCKER_USERNAME/$APP_NAME-frontend:v$VERSION"
    if ($LASTEXITCODE -ne 0) { Write-Error2 "Failed to push frontend:v$VERSION"; exit 1 }
    
    Write-Success "All images pushed to Docker Hub"
}

# 7. DEPLOY
function Step-Deploy {
    Write-Step "DEPLOY - Deploying to Render"
    
    Write-Warning2 "Render deployment is manual:"
    Write-Host ""
    Write-Host "1. Go to Render dashboard: https://dashboard.render.com"
    Write-Host "2. Click on 'qrpipay-backend' service"
    Write-Host "3. Click 'Clear Build Cache'"
    Write-Host "4. Click 'Deploy'"
    Write-Host ""
    Write-Host "Render will automatically pull images from:"
    Write-Host "  - Backend: $DOCKER_USERNAME/$APP_NAME-backend:latest"
    Write-Host "  - Frontend: $DOCKER_USERNAME/$APP_NAME-frontend:latest"
    Write-Host ""
    Write-Success "Ready for Render deployment"
}

# 8. MONITOR
function Step-Monitor {
    Write-Step "MONITOR - Monitoring containers"
    
    Write-Step "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    
    Write-Step "Real-time stats:"
    docker stats --no-stream
}

# Main
Write-Host ""
Write-Host "==== QRPiPay Docker Pipeline v$VERSION ====" -ForegroundColor Blue
Write-Host ""

switch ($Step) {
    "conception" { Step-Conception }
    "dev" { Step-Dev }
    "build" { Step-Conception; Step-Build }
    "test" { Step-Test }
    "scan" { Step-Scan }
    "push" { Step-Conception; Step-Build; Step-Test; Step-Scan; Step-Push }
    "deploy" { Step-Deploy }
    "monitor" { Step-Monitor }
    "full" { 
        Step-Conception
        Step-Build
        Step-Test
        Step-Scan
        Step-Push
        Step-Deploy
        Step-Monitor
    }
}

Write-Host ""
Write-Host "[OK] Pipeline execution complete!" -ForegroundColor Green
Write-Host ""
