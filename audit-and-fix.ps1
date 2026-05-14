# QRPiPay - DEEP AUDIT & AUTO-FIX SCRIPT

param([ValidateSet("audit", "fix", "full")][string]$Mode = "full")

Write-Host ""
Write-Host "==== QRPiPay Deep Audit & Auto-Fix ===" -ForegroundColor Blue
Write-Host ""

# FIX BACKEND TYPESCRIPT
Write-Host "=== FIXING BACKEND ===" -ForegroundColor Blue

$tsFiles = Get-ChildItem -Path "backend/src" -Recurse -Filter "*.ts" 2>$null

foreach ($file in $tsFiles) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    if ($content -match "catch\s*\(\s*error\s*\)\s*\{") {
        $content = $content -replace "catch\s*\(\s*error\s*\)\s*\{", "catch (error: unknown) {"
        $modified = $true
        Write-Host "[FIXED] $($file.Name) - catch error typing" -ForegroundColor Green
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
    }
}

# FIX FRONTEND POSTCSS
Write-Host ""
Write-Host "=== FIXING FRONTEND ===" -ForegroundColor Blue

if (Test-Path "frontend/postcss.config.cjs") {
    $postcssContent = Get-Content "frontend/postcss.config.cjs" -Raw
    if ($postcssContent -match "export\s+default") {
        $postcssContent = $postcssContent -replace "export\s+default", "module.exports ="
        Set-Content -Path "frontend/postcss.config.cjs" -Value $postcssContent
        Write-Host "[FIXED] postcss.config.cjs - CommonJS syntax" -ForegroundColor Green
    }
}

# ENSURE TERSER
Write-Host "Checking terser dependency..."
$pkgPath = "frontend/package.json"
$packageJson = Get-Content $pkgPath | ConvertFrom-Json

if (-not $packageJson.devDependencies.terser) {
    $packageJson.devDependencies | Add-Member -NotePropertyName "terser" -NotePropertyValue "^5.31.0" -Force
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $pkgPath
    Write-Host "[FIXED] frontend/package.json - added terser" -ForegroundColor Green
}

# CREATE DOCKERIGNORE FILES
Write-Host ""
Write-Host "=== CREATING .dockerignore FILES ===" -ForegroundColor Blue

$dockerignoreContent = @(
    "node_modules",
    "npm-debug.log",
    ".git",
    ".gitignore",
    ".env.local",
    "dist",
    "build",
    ".DS_Store",
    "*.log"
) -join "`n"

@("backend", "frontend") | ForEach-Object {
    $dockerignorePath = "$_\.dockerignore"
    if (-not (Test-Path $dockerignorePath)) {
        Set-Content -Path $dockerignorePath -Value $dockerignoreContent
        Write-Host "[CREATED] $_\.dockerignore" -ForegroundColor Green
    }
}

# VALIDATE DOCKERFILES
Write-Host ""
Write-Host "=== VALIDATING DOCKERFILES ===" -ForegroundColor Blue

@("backend", "frontend") | ForEach-Object {
    $dockerfile = "$_\Dockerfile"
    if (Test-Path $dockerfile) {
        $content = Get-Content $dockerfile -Raw
        
        if ($content -match "npm install" -and $content -notmatch "legacy-peer-deps") {
            $content = $content -replace "npm install", "npm install --legacy-peer-deps"
            Set-Content -Path $dockerfile -Value $content
            Write-Host "[FIXED] $_\Dockerfile - added --legacy-peer-deps" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "[OK] All fixes completed!" -ForegroundColor Green
Write-Host ""
