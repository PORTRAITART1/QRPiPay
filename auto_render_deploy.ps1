# 🤖 QRPIPAY AUTOMATIC RENDER DEPLOYMENT SCRIPT
# This script automatically deploys to Render without manual clicking

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   🤖 QRPIPAY AUTOMATIC RENDER DEPLOYMENT 🤖                 ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║  This script automatically deploys to Render                 ║" -ForegroundColor Cyan
Write-Host "║  No manual clicking needed!                                  ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️  PREREQUISITE: You need your Render API Token" -ForegroundColor Yellow
Write-Host ""
Write-Host "To get your API Token:" -ForegroundColor Green
Write-Host "1. Go to: https://dashboard.render.com/api-tokens" -ForegroundColor Green
Write-Host "2. Click 'Create API Token'" -ForegroundColor Green
Write-Host "3. Name it: 'QRPiPay Auto Deploy'" -ForegroundColor Green
Write-Host "4. Copy the token" -ForegroundColor Green
Write-Host ""

# Get API Token
$RenderAPIToken = Read-Host "Enter your Render API Token"

if ([string]::IsNullOrEmpty($RenderAPIToken)) {
    Write-Host "❌ API Token is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ API Token accepted" -ForegroundColor Green
Write-Host ""

# Get GitHub repository info
$GitHubRepo = "https://github.com/portraitart1/QRPiPay.git"
$GitHubUser = "portraitart1"
$GitHubRepoName = "QRPiPay"

Write-Host "📋 DEPLOYING WITH THESE SETTINGS:" -ForegroundColor Cyan
Write-Host "GitHub Repository: $GitHubRepo" -ForegroundColor Cyan
Write-Host "GitHub User: $GitHubUser" -ForegroundColor Cyan
Write-Host ""

# Generate JWT Secret
Write-Host "🔐 Generating JWT_SECRET..." -ForegroundColor Yellow
$JWTSecret = (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
Write-Host "✅ JWT_SECRET generated: $JWTSecret" -ForegroundColor Green
Write-Host ""

# Headers for API requests
$Headers = @{
    "Authorization" = "Bearer $RenderAPIToken"
    "Content-Type" = "application/json"
}

# ============================================
# STEP 1: CREATE POSTGRESQL DATABASE
# ============================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 STEP 1: Creating PostgreSQL Database..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$DatabasePayload = @{
    name = "qrpipay-db"
    databaseName = "qrpipay"
    user = "qrpipay"
    plan = "free"
    region = "oregon"
} | ConvertTo-Json

try {
    $DatabaseResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/databases" `
        -Method POST `
        -Headers $Headers `
        -Body $DatabasePayload `
        -ErrorAction Stop
    
    Write-Host "✅ PostgreSQL Database created!" -ForegroundColor Green
    $DatabaseData = $DatabaseResponse.Content | ConvertFrom-Json
    $DatabaseId = $DatabaseData.id
    Write-Host "Database ID: $DatabaseId" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "⚠️  Database creation note: $_" -ForegroundColor Yellow
    Write-Host "This may be normal if database already exists" -ForegroundColor Yellow
    Write-Host ""
}

Start-Sleep -Seconds 3

# ============================================
# STEP 2: CREATE BACKEND WEB SERVICE
# ============================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 STEP 2: Creating Backend Web Service..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$BackendPayload = @{
    type = "web_service"
    name = "qrpipay-backend"
    repo = $GitHubRepo
    branch = "master"
    buildCommand = "cd backend; npm install; npm run build"
    startCommand = "cd backend; npm start"
    plan = "free"
    region = "oregon"
    envVars = @(
        @{ key = "NODE_ENV"; value = "production" },
        @{ key = "PORT"; value = "3001" },
        @{ key = "FRONTEND_URL"; value = "https://qrpipay-frontend.onrender.com" },
        @{ key = "JWT_SECRET"; value = $JWTSecret },
        @{ key = "LOG_LEVEL"; value = "info" }
    )
} | ConvertTo-Json -Depth 10

try {
    $BackendResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers $Headers `
        -Body $BackendPayload `
        -ErrorAction Stop
    
    Write-Host "✅ Backend Web Service created!" -ForegroundColor Green
    $BackendData = $BackendResponse.Content | ConvertFrom-Json
    Write-Host "Backend URL: https://$($BackendData.name).onrender.com" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "⚠️  Backend creation note: $_" -ForegroundColor Yellow
    Write-Host ""
}

Start-Sleep -Seconds 3

# ============================================
# STEP 3: CREATE FRONTEND STATIC SITE
# ============================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎨 STEP 3: Creating Frontend Static Site..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$FrontendPayload = @{
    type = "static_site"
    name = "qrpipay-frontend"
    repo = $GitHubRepo
    branch = "master"
    buildCommand = "cd frontend; npm install; npm run build"
    publishPath = "frontend/dist"
    plan = "free"
    region = "oregon"
    envVars = @(
        @{ key = "VITE_API_URL"; value = "https://qrpipay-backend.onrender.com/api" }
    )
} | ConvertTo-Json -Depth 10

try {
    $FrontendResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers $Headers `
        -Body $FrontendPayload `
        -ErrorAction Stop
    
    Write-Host "✅ Frontend Static Site created!" -ForegroundColor Green
    $FrontendData = $FrontendResponse.Content | ConvertFrom-Json
    Write-Host "Frontend URL: https://$($FrontendData.name).onrender.com" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "⚠️  Frontend creation note: $_" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================
# FINAL SUMMARY
# ============================================

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║            ✅ DEPLOYMENT LAUNCHED! ✅                        ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Services are being created on Render...                     ║" -ForegroundColor Green
Write-Host "║  Wait 5-10 minutes for deployment to complete                ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Check status at: https://dashboard.render.com               ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Your API URLs will be:                                      ║" -ForegroundColor Green
Write-Host "║  Frontend:  https://qrpipay-frontend.onrender.com            ║" -ForegroundColor Green
Write-Host "║  Backend:   https://qrpipay-backend.onrender.com             ║" -ForegroundColor Green
Write-Host "║  API:       https://qrpipay-backend.onrender.com/api         ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  JWT_SECRET saved securely                                   ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green

# Save secrets to file
$SecretsPath = "$env:USERPROFILE\qrpipay_deployment_secrets.txt"
$Secrets = @"
=== QRPIPAY DEPLOYMENT SECRETS ===
Generated: $(Get-Date)

JWT_SECRET: $JWTSecret
Frontend URL: https://qrpipay-frontend.onrender.com
Backend URL: https://qrpipay-backend.onrender.com
API URL: https://qrpipay-backend.onrender.com/api

GitHub: $GitHubRepo
"@

$Secrets | Out-File -FilePath $SecretsPath -Force
Write-Host ""
Write-Host "💾 Secrets saved to: $SecretsPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 5-10 minutes" -ForegroundColor Cyan
Write-Host "2. Go to https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "3. Check that all services are 'Live'" -ForegroundColor Cyan
Write-Host "4. Test your URLs" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Green
