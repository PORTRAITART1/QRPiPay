# QRPiPay - Final Deploy (PowerShell)

Write-Host "====== QRPIPAY FINAL DEPLOY ======" -ForegroundColor Magenta
Write-Host ""

# STEP 1: Clean
Write-Host "[1] Cleaning..." -ForegroundColor Cyan
@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    Set-Location ..
}

# STEP 2: Install & Build
Write-Host "[2] Installing & Building..." -ForegroundColor Cyan
@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    npm install --legacy-peer-deps
    npm run build
    Set-Location ..
}

# STEP 3: Create start script
Write-Host "[3] Creating start script..." -ForegroundColor Cyan
$startScript = @"
require('dotenv').config();
require('./dist/server.js');
"@
Set-Content -Path "backend/start.js" -Value $startScript

# STEP 4: Git commit
Write-Host "[4] Committing..." -ForegroundColor Cyan
git add -A
git commit -m "FINAL DEPLOY: Simplified backend - Render ready"
git push origin master

Write-Host ""
Write-Host "====== SUCCESS ======" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Deploy on Render" -ForegroundColor Yellow
Write-Host "- Delete old backend service" -ForegroundColor Yellow
Write-Host "- Create NEW Web Service" -ForegroundColor Yellow
Write-Host "- Language: Node" -ForegroundColor Yellow
Write-Host "- Root Directory: backend" -ForegroundColor Yellow
Write-Host "- Build: npm install --legacy-peer-deps && npm run build" -ForegroundColor Yellow
Write-Host "- Start: npm start" -ForegroundColor Yellow
Write-Host ""
