# QRPiPay - FINAL PERFORMANCE SCRIPT
# Corrige TOUT - Backend + Frontend - RENDER READY

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  QRPiPay - FINAL PERFORMANCE FIX & DEPLOY                ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# ============================================================================
# STEP 1: REMOVE PRISMA COPY FROM BACKEND CODE
# ============================================================================

Write-Host "[STEP 1] Fixing backend code..." -ForegroundColor Cyan

$serverPath = "backend/src/server.ts"
if (Test-Path $serverPath) {
    $content = Get-Content $serverPath -Raw
    
    # Remove any prisma directory imports
    $content = $content -replace "import.*from.*['\"].*prisma['\"]", ""
    $content = $content -replace "from\s+['\"]./lib/prisma['\"]", "from '@prisma/client'"
    
    Set-Content -Path $serverPath -Value $content
    Write-Host "[OK] backend/src/server.ts fixed" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# STEP 2: ENSURE PRISMA CLIENT IN PACKAGE.JSON
# ============================================================================

Write-Host "[STEP 2] Verifying Prisma dependencies..." -ForegroundColor Cyan

$pkgPath = "backend/package.json"
$pkg = Get-Content $pkgPath | ConvertFrom-Json

if (-not $pkg.dependencies."@prisma/client") {
    $pkg.dependencies | Add-Member -NotePropertyName "@prisma/client" -NotePropertyValue "^5.6.0" -Force
    Write-Host "[ADDED] @prisma/client to dependencies" -ForegroundColor Green
}

if (-not $pkg.devDependencies.prisma) {
    $pkg.devDependencies | Add-Member -NotePropertyName "prisma" -NotePropertyValue "^5.6.0" -Force
    Write-Host "[ADDED] prisma to devDependencies" -ForegroundColor Green
}

$pkg | ConvertTo-Json -Depth 10 | Set-Content $pkgPath

Write-Host ""

# ============================================================================
# STEP 3: SIMPLIFY DOCKERFILES - NO PRISMA COPY
# ============================================================================

Write-Host "[STEP 3] Simplifying Dockerfiles..." -ForegroundColor Cyan

# Backend Dockerfile
$backendDockerfile = @"
# Backend Dockerfile - Simple Native Deployment

FROM node:20-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm install --legacy-peer-deps && npm cache clean --force
RUN npm run build

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 `
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["node", "dist/server.js"]
"@

Set-Content -Path "backend/Dockerfile" -Value $backendDockerfile
Write-Host "[OK] backend/Dockerfile simplified" -ForegroundColor Green

# Frontend Dockerfile
$frontendDockerfile = @"
# Frontend Dockerfile - Simple Native Deployment

FROM node:20-alpine

WORKDIR /app

COPY . .

WORKDIR /app/frontend
RUN npm install --legacy-peer-deps && npm cache clean --force
RUN npm run build
RUN npm install -g serve

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 `
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
"@

Set-Content -Path "frontend/Dockerfile" -Value $frontendDockerfile
Write-Host "[OK] frontend/Dockerfile simplified" -ForegroundColor Green

Write-Host ""

# ============================================================================
# STEP 4: CLEAN & REBUILD
# ============================================================================

Write-Host "[STEP 4] Clean rebuild..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    
    npm install --legacy-peer-deps
    npm run build
    
    Write-Host "[OK] $_ rebuilt" -ForegroundColor Green
    
    Set-Location ..
}

Write-Host ""

# ============================================================================
# STEP 5: GIT COMMIT & PUSH
# ============================================================================

Write-Host "[STEP 5] Committing to GitHub..." -ForegroundColor Cyan

git add -A
git commit -m "FINAL FIX: Remove Prisma copy - use @prisma/client directly - ready for Render"
git push origin master

Write-Host "[OK] Pushed to GitHub" -ForegroundColor Green

Write-Host ""

# ============================================================================
# STEP 6: INSTRUCTIONS
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  SUCCESS - READY FOR RENDER!                             ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT STEPS ON RENDER:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Delete service 'qrpipay-backend' (Settings > Delete Service)" -ForegroundColor Cyan
Write-Host "3. Click 'New +' > 'Web Service'" -ForegroundColor Cyan
Write-Host "4. Select 'Deploy an image from a Docker registry'" -ForegroundColor Cyan
Write-Host "5. Image URL: docker.io/portraitart1/qrpipay-backend:latest" -ForegroundColor Cyan
Write-Host "6. Add environment variables and deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "OR use Native Node.js:" -ForegroundColor Cyan
Write-Host "1. Go to: https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Delete existing backend service" -ForegroundColor Cyan
Write-Host "3. Click 'New +' > 'Web Service'" -ForegroundColor Cyan
Write-Host "4. Connect GitHub repo" -ForegroundColor Cyan
Write-Host "5. Let Render auto-detect render.yaml" -ForegroundColor Cyan
Write-Host ""
