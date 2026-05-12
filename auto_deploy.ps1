# 🚀 QRPIPAY AUTOMATED DEPLOYMENT - POWERSHELL VERSION
# Script d'automatisation du déploiement Render

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║        🚀 QRPIPAY AUTOMATED RENDER DEPLOYMENT 🚀             ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║  Ce script automatise le déploiement sur Render               ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️  IMPORTANT: Vous avez besoin de votre Render API Key" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour obtenir votre API Key:" -ForegroundColor Green
Write-Host "1. Allez sur: https://dashboard.render.com/api-tokens" -ForegroundColor Green
Write-Host "2. Cliquez 'Create API Token'" -ForegroundColor Green
Write-Host "3. Copiez le token" -ForegroundColor Green
Write-Host ""

# Get API Key
$RenderAPIKey = Read-Host "Entrez votre Render API Token"

if ([string]::IsNullOrEmpty($RenderAPIKey)) {
    Write-Host "❌ API Key requise!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ API Key acceptée" -ForegroundColor Green
Write-Host ""

# Generate JWT Secret
Write-Host "🔐 Génération du JWT_SECRET..." -ForegroundColor Yellow
$JWTSecret = (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
Write-Host "✅ JWT_SECRET généré: $JWTSecret" -ForegroundColor Green
Write-Host ""

# Save to file
$SecretsPath = "$env:USERPROFILE\qrpipay_deployment_secrets.txt"
$JWTSecret | Out-File -FilePath $SecretsPath
Write-Host "💾 Sauvegardé dans: $SecretsPath" -ForegroundColor Cyan

# Step 1: Create PostgreSQL Database
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 STEP 1: Création de la base de données PostgreSQL..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$dbPayload = @{
    name = "qrpipay-db"
    databaseName = "qrpipay"
    user = "qrpipay"
    plan = "free"
    region = "oregon"
} | ConvertTo-Json

try {
    $dbResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/databases" `
        -Method POST `
        -Headers @{"Authorization" = "Bearer $RenderAPIKey"; "Content-Type" = "application/json"} `
        -Body $dbPayload `
        -ErrorAction Stop
    
    Write-Host "✅ Base de données créée!" -ForegroundColor Green
    $dbData = $dbResponse.Content | ConvertFrom-Json
    Write-Host "Database ID: $($dbData.id)" -ForegroundColor Cyan
    
    # Extract and save connection string
    $dbConnectionString = $dbData.connectionString
    if ($dbConnectionString) {
        "DATABASE_URL=$dbConnectionString" | Add-Content -Path $SecretsPath
        Write-Host "Connection String sauvegardée!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Erreur lors de la création de la database: $_" -ForegroundColor Yellow
    Write-Host "Si l'erreur est 'database already exists', c'est normal!" -ForegroundColor Yellow
}

Start-Sleep -Seconds 3

# Step 2: Create Backend Web Service
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 STEP 2: Création du service Backend..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$backendPayload = @{
    type = "web_service"
    name = "qrpipay-backend"
    repo = "https://github.com/portraitart1/qrpipay"
    branch = "master"
    buildCommand = "cd backend && npm install && npm run build"
    startCommand = "cd backend && npm start"
    plan = "free"
    region = "oregon"
} | ConvertTo-Json

try {
    $backendResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers @{"Authorization" = "Bearer $RenderAPIKey"; "Content-Type" = "application/json"} `
        -Body $backendPayload `
        -ErrorAction Stop
    
    Write-Host "✅ Service Backend créé!" -ForegroundColor Green
    $backendData = $backendResponse.Content | ConvertFrom-Json
    Write-Host "Backend URL: https://$($backendData.name).onrender.com" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Erreur lors de la création du backend: $_" -ForegroundColor Yellow
}

Start-Sleep -Seconds 3

# Step 3: Create Frontend Static Site
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎨 STEP 3: Création du site Frontend..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$frontendPayload = @{
    type = "static_site"
    name = "qrpipay-frontend"
    repo = "https://github.com/portraitart1/qrpipay"
    branch = "master"
    buildCommand = "cd frontend && npm install && npm run build"
    publishPath = "frontend/dist"
    plan = "free"
    region = "oregon"
} | ConvertTo-Json

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://api.render.com/v1/services" `
        -Method POST `
        -Headers @{"Authorization" = "Bearer $RenderAPIKey"; "Content-Type" = "application/json"} `
        -Body $frontendPayload `
        -ErrorAction Stop
    
    Write-Host "✅ Site Frontend créé!" -ForegroundColor Green
    $frontendData = $frontendResponse.Content | ConvertFrom-Json
    Write-Host "Frontend URL: https://$($frontendData.name).onrender.com" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Erreur lors de la création du frontend: $_" -ForegroundColor Yellow
}

# Final Summary
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║            ✅ DÉPLOIEMENT LANCÉ! ✅                          ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Services en cours de création sur Render...                  ║" -ForegroundColor Green
Write-Host "║  Attendez 5-10 minutes                                        ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  Vérifiez sur: https://dashboard.render.com                  ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "║  JWT_SECRET: $JWTSecret" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Informations sauvegardées dans:" -ForegroundColor Cyan
Write-Host "$SecretsPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Attendez 5-10 minutes" -ForegroundColor Cyan
Write-Host "2. Allez sur https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "3. Vérifiez que les services sont 'Live'" -ForegroundColor Cyan
Write-Host "4. Lancez les migrations database" -ForegroundColor Cyan
Write-Host ""
