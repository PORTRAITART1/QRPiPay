# PowerShell Render Deployment Script
# Creates QRPiPay services on Render

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 QRPIPAY RENDER DEPLOYMENT 🚀                            ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$APIToken = Read-Host "Enter your Render API Token"

if ([string]::IsNullOrEmpty($APIToken)) {
    Write-Host "Error: API Token required" -ForegroundColor Red
    exit 1
}

Write-Host ""
$DatabaseURL = Read-Host "Enter your DATABASE_URL"

if ([string]::IsNullOrEmpty($DatabaseURL)) {
    Write-Host "Error: DATABASE_URL required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Generating JWT_SECRET..." -ForegroundColor Yellow
$JWTSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host "JWT_SECRET: $JWTSecret" -ForegroundColor Green

$Headers = @{
    "Authorization" = "Bearer $APIToken"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "Creating Backend Service..." -ForegroundColor Cyan

$BackendPayload = @{
    type = "web_service"
    name = "qrpipay-backend"
    repo = "https://github.com/portraitart1/QRPiPay.git"
    branch = "master"
    buildCommand = "cd backend && npm install && npm run build"
    startCommand = "cd backend && npm start"
    plan = "free"
    region = "oregon"
    envVars = @(
        @{ key = "NODE_ENV"; value = "production" },
        @{ key = "PORT"; value = "3001" },
        @{ key = "DATABASE_URL"; value = $DatabaseURL },
        @{ key = "FRONTEND_URL"; value = "https://qrpipay-frontend.onrender.com" },
        @{ key = "JWT_SECRET"; value = $JWTSecret },
        @{ key = "LOG_LEVEL"; value = "info" }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers $Headers `
        -Body $BackendPayload `
        -UseBasicParsing | Out-Null
    Write-Host "Backend service created!" -ForegroundColor Green
} catch {
    Write-Host "Backend error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Creating Frontend Service..." -ForegroundColor Cyan

$FrontendPayload = @{
    type = "static_site"
    name = "qrpipay-frontend"
    repo = "https://github.com/portraitart1/QRPiPay.git"
    branch = "master"
    buildCommand = "cd frontend && npm install && npm run build"
    publishPath = "frontend/dist"
    plan = "free"
    region = "oregon"
    envVars = @(
        @{ key = "VITE_API_URL"; value = "https://qrpipay-backend.onrender.com/api" }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers $Headers `
        -Body $FrontendPayload `
        -UseBasicParsing | Out-Null
    Write-Host "Frontend service created!" -ForegroundColor Green
} catch {
    Write-Host "Frontend error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT INITIATED!                                   ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Wait 5-10 minutes, then check:                              ║" -ForegroundColor Green
Write-Host "║  https://dashboard.render.com                                ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Frontend:  https://qrpipay-frontend.onrender.com            ║" -ForegroundColor Green
Write-Host "║  Backend:   https://qrpipay-backend.onrender.com             ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
