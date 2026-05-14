# QRPiPay - MASTER FIX SCRIPT

Write-Host ""
Write-Host "==== QRPIPAY MASTER FIX ====" -ForegroundColor Magenta
Write-Host ""

# PHASE 1: CLEAN
Write-Host "[1] CLEANING..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    Write-Host "[OK] $_ cleaned" -ForegroundColor Green
    Set-Location ..
}

npm cache clean --force 2>&1 | Out-Null
Write-Host "[OK] npm cache cleaned" -ForegroundColor Green
Write-Host ""

# PHASE 2: INSTALL
Write-Host "[2] INSTALLING..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    npm install --legacy-peer-deps
    Write-Host "[OK] $_ installed" -ForegroundColor Green
    Set-Location ..
}

Write-Host ""

# PHASE 3: BUILD
Write-Host "[3] BUILDING..." -ForegroundColor Cyan

Set-Location backend
npm run build
Write-Host "[OK] Backend built" -ForegroundColor Green
Set-Location ..

Set-Location frontend
npm run build
Write-Host "[OK] Frontend built" -ForegroundColor Green
Set-Location ..

Write-Host ""

# PHASE 4: GIT
Write-Host "[4] COMMITTING..." -ForegroundColor Cyan

git add -A
git commit -m "MASTER FIX: Clean rebuild"
git push origin master
Write-Host "[OK] Pushed to GitHub" -ForegroundColor Green

Write-Host ""
Write-Host "==== SUCCESS ====" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Deploy on Render" -ForegroundColor Yellow
Write-Host ""
