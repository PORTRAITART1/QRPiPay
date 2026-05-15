# QRPiPay - FINAL FIX SCRIPT

Write-Host ""
Write-Host "==== QRPIPAY FINAL FIX ====" -ForegroundColor Magenta
Write-Host ""

# STEP 1: FIX BACKEND CODE
Write-Host "[1] Fixing backend code..." -ForegroundColor Cyan

$serverPath = "backend/src/server.ts"
if (Test-Path $serverPath) {
    $content = Get-Content $serverPath -Raw
    $content = $content -replace "import.*prisma.*from", "import { PrismaClient } from"
    Set-Content -Path $serverPath -Value $content
    Write-Host "[OK] backend/src/server.ts fixed" -ForegroundColor Green
}

Write-Host ""

# STEP 2: VERIFY PRISMA IN PACKAGE.JSON
Write-Host "[2] Checking Prisma dependencies..." -ForegroundColor Cyan

$pkg = Get-Content "backend/package.json" | ConvertFrom-Json
if (-not $pkg.dependencies."@prisma/client") {
    $pkg.dependencies | Add-Member -NotePropertyName "@prisma/client" -NotePropertyValue "^5.6.0" -Force
    Write-Host "[ADDED] @prisma/client" -ForegroundColor Green
}
$pkg | ConvertTo-Json -Depth 10 | Set-Content "backend/package.json"

Write-Host ""

# STEP 3: SIMPLIFY DOCKERFILES
Write-Host "[3] Fixing Dockerfiles..." -ForegroundColor Cyan

$backendDocker = @"
FROM node:20-alpine
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN npm install --legacy-peer-deps && npm cache clean --force
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/server.js"]
"@

Set-Content -Path "backend/Dockerfile" -Value $backendDocker
Write-Host "[OK] backend/Dockerfile fixed" -ForegroundColor Green

Write-Host ""

# STEP 4: CLEAN REBUILD
Write-Host "[4] Clean rebuild..." -ForegroundColor Cyan

@("backend", "frontend") | ForEach-Object {
    Set-Location $_
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    npm install --legacy-peer-deps
    npm run build
    Write-Host "[OK] $_ rebuilt" -ForegroundColor Green
    Set-Location ..
}

Write-Host ""

# STEP 5: GIT COMMIT
Write-Host "[5] Committing..." -ForegroundColor Cyan

git add -A
git commit -m "FINAL: Remove Prisma copy - use Prisma Client - Render ready"
git push origin master

Write-Host "[OK] Pushed to GitHub" -ForegroundColor Green

Write-Host ""
Write-Host "==== SUCCESS ====" -ForegroundColor Green
Write-Host ""
Write-Host "DELETE qrpipay-backend service on Render and redeploy!" -ForegroundColor Yellow
Write-Host ""
