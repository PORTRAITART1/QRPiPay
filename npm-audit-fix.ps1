# QRPiPay - COMPREHENSIVE NPM AUDIT & FIX

Write-Host ""
Write-Host "======================================================" -ForegroundColor Magenta
Write-Host "QRPiPay - NPM AUDIT & DEEP FIX" -ForegroundColor Magenta
Write-Host "======================================================" -ForegroundColor Magenta
Write-Host ""

# STEP 1: BACKEND NPM AUDIT
Write-Host "[STEP 1] Auditing Backend NPM..." -ForegroundColor Cyan

Set-Location backend

Write-Host "Checking backend dependencies..."

# Show current npm version
npm --version

# List all packages
Write-Host ""
Write-Host "Backend npm packages:" -ForegroundColor Yellow
npm list --depth=0 2>&1 | Head -20

# Check for vulnerabilities
Write-Host ""
Write-Host "Checking for vulnerabilities..." -ForegroundColor Yellow
npm audit 2>&1 | Head -30

Set-Location ..

Write-Host ""

# STEP 2: FRONTEND NPM AUDIT
Write-Host "[STEP 2] Auditing Frontend NPM..." -ForegroundColor Cyan

Set-Location frontend

Write-Host "Checking frontend dependencies..."

# List all packages
Write-Host ""
Write-Host "Frontend npm packages:" -ForegroundColor Yellow
npm list --depth=0 2>&1 | Head -20

# Check for vulnerabilities
Write-Host ""
Write-Host "Checking for vulnerabilities..." -ForegroundColor Yellow
npm audit 2>&1 | Head -30

Set-Location ..

Write-Host ""

# STEP 3: REMOVE DUPLICATES & CLEAN
Write-Host "[STEP 3] Removing duplicates..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Write-Host ""
    Write-Host "Processing $_..." -ForegroundColor Yellow
    
    Set-Location $_
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Write-Host "Removing node_modules..."
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Write-Host "[OK] node_modules removed" -ForegroundColor Green
    }
    
    # Remove package-lock.json
    if (Test-Path "package-lock.json") {
        Write-Host "Removing package-lock.json..."
        Remove-Item package-lock.json -ErrorAction SilentlyContinue
        Write-Host "[OK] package-lock.json removed" -ForegroundColor Green
    }
    
    # Clean npm cache
    Write-Host "Cleaning npm cache..."
    npm cache clean --force 2>&1 | Out-Null
    Write-Host "[OK] npm cache cleaned" -ForegroundColor Green
    
    Set-Location ..
}

Write-Host ""

# STEP 4: REINSTALL CLEAN
Write-Host "[STEP 4] Reinstalling dependencies..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Write-Host ""
    Write-Host "Installing $_ dependencies..." -ForegroundColor Yellow
    
    Set-Location $_
    
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $_ dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $_ installation failed!" -ForegroundColor Red
    }
    
    Set-Location ..
}

Write-Host ""

# STEP 5: VERIFY BUILDS
Write-Host "[STEP 5] Verifying builds..." -ForegroundColor Cyan

Write-Host ""
Write-Host "Building backend..." -ForegroundColor Yellow
Set-Location backend
npm run build 2>&1 | Tail -10
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Backend build successful" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backend build failed!" -ForegroundColor Red
}
Set-Location ..

Write-Host ""
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build 2>&1 | Tail -10
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend build failed!" -ForegroundColor Red
}
Set-Location ..

Write-Host ""

# STEP 6: FINAL AUDIT
Write-Host "[STEP 6] Final audit..." -ForegroundColor Cyan

Write-Host ""
Write-Host "Backend package.json validation:" -ForegroundColor Yellow
Set-Location backend
npm list --all 2>&1 | Head -10
Set-Location ..

Write-Host ""
Write-Host "Frontend package.json validation:" -ForegroundColor Yellow
Set-Location frontend
npm list --all 2>&1 | Head -10
Set-Location ..

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "NPM AUDIT & FIX COMPLETE!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run the build pipeline again" -ForegroundColor Yellow
Write-Host "powershell -ExecutionPolicy Bypass -File deploy-pipeline-autofix.ps1 -Step build" -ForegroundColor Cyan
Write-Host ""
