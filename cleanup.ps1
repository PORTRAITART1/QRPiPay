# QRPiPay - Docker & NPM Cleanup Script

param(
    [ValidateSet("npm", "docker", "full")]
    [string]$CleanupType = "full"
)

function Write-Step {
    Write-Host "=== $args ===" -ForegroundColor Blue
}

function Write-Success {
    Write-Host "[OK] $args" -ForegroundColor Green
}

function Write-Warning2 {
    Write-Host "[WARNING] $args" -ForegroundColor Yellow
}

# NPM CLEANUP
function Cleanup-NPM {
    Write-Step "NPM CLEANUP - Removing duplicates and cache"
    
    Write-Step "Cleaning backend npm..."
    Set-Location backend
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Write-Step "Removing node_modules..."
        Remove-Item -Recurse -Force node_modules
        Write-Success "node_modules removed"
    }
    
    # Remove package-lock.json
    if (Test-Path "package-lock.json") {
        Write-Step "Removing package-lock.json..."
        Remove-Item package-lock.json
        Write-Success "package-lock.json removed"
    }
    
    # Clean npm cache
    Write-Step "Cleaning npm cache..."
    npm cache clean --force
    Write-Success "npm cache cleaned"
    
    # Reinstall clean
    Write-Step "Reinstalling dependencies..."
    npm install --legacy-peer-deps
    Write-Success "Dependencies reinstalled"
    
    Set-Location ..
    
    Write-Step "Cleaning frontend npm..."
    Set-Location frontend
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Write-Step "Removing node_modules..."
        Remove-Item -Recurse -Force node_modules
        Write-Success "node_modules removed"
    }
    
    # Remove package-lock.json
    if (Test-Path "package-lock.json") {
        Write-Step "Removing package-lock.json..."
        Remove-Item package-lock.json
        Write-Success "package-lock.json removed"
    }
    
    # Clean npm cache
    Write-Step "Cleaning npm cache..."
    npm cache clean --force
    Write-Success "npm cache cleaned"
    
    # Reinstall clean
    Write-Step "Reinstalling dependencies..."
    npm install
    Write-Success "Dependencies reinstalled"
    
    Set-Location ..
    
    Write-Success "NPM cleanup complete!"
}

# DOCKER CLEANUP
function Cleanup-Docker {
    Write-Step "DOCKER CLEANUP - Removing dangling images and containers"
    
    # Stop all containers
    Write-Step "Stopping all containers..."
    $containers = docker ps -aq
    if ($containers) {
        docker stop $containers
        Write-Success "Containers stopped"
    }
    
    # Remove stopped containers
    Write-Step "Removing stopped containers..."
    docker container prune -f
    Write-Success "Stopped containers removed"
    
    # Remove dangling images
    Write-Step "Removing dangling images..."
    docker image prune -f
    Write-Success "Dangling images removed"
    
    # Remove unused volumes
    Write-Step "Removing unused volumes..."
    docker volume prune -f
    Write-Success "Unused volumes removed"
    
    # Remove build cache
    Write-Step "Cleaning build cache..."
    docker builder prune -f
    Write-Success "Build cache cleaned"
    
    # Show remaining images
    Write-Step "Remaining Docker images:"
    docker images
    
    Write-Success "Docker cleanup complete!"
}

# FULL CLEANUP
function Cleanup-Full {
    Cleanup-NPM
    Write-Host ""
    Cleanup-Docker
}

# MAIN
Write-Host ""
Write-Host "==== QRPiPay Cleanup Utility ====" -ForegroundColor Blue
Write-Host ""

switch ($CleanupType) {
    "npm" { Cleanup-NPM }
    "docker" { Cleanup-Docker }
    "full" { Cleanup-Full }
}

Write-Host ""
Write-Host "[OK] Cleanup complete!" -ForegroundColor Green
Write-Host ""
