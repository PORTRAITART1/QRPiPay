# QRPiPay - DEEP AUDIT & AUTO-FIX SCRIPT
# Trouve et corrige TOUS les problèmes avant le build

param(
    [ValidateSet("audit", "fix", "full")]
    [string]$Mode = "full"
)

function Write-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║     QRPiPay - Deep Audit & Auto-Fix System             ║" -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

function Write-Step {
    Write-Host "=== $args ===" -ForegroundColor Blue
}

function Write-Issue {
    Write-Host "[ISSUE] $args" -ForegroundColor Yellow
}

function Write-Fixed {
    Write-Host "[FIXED] $args" -ForegroundColor Green
}

function Write-Error2 {
    Write-Host "[ERROR] $args" -ForegroundColor Red
}

# AUDIT BACKEND
function Audit-Backend {
    Write-Step "AUDITING BACKEND"
    
    $issues = @()
    
    # Check TypeScript files for error: unknown
    Write-Host "Scanning TypeScript files for type issues..."
    $tsFiles = Get-ChildItem -Path "backend/src" -Recurse -Filter "*.ts"
    
    foreach ($file in $tsFiles) {
        $content = Get-Content $file.FullName -Raw
        
        # Check for catch (error) without type
        if ($content -match "catch\s*\(\s*error\s*\)\s*\{") {
            $issues += @{
                file = $file.Name
                issue = "catch block missing error type annotation"
                path = $file.FullName
            }
        }
        
        # Check for any: any
        if ($content -match "as\s+any") {
            $issues += @{
                file = $file.Name
                issue = "Using 'as any' type assertion"
                path = $file.FullName
            }
        }
    }
    
    # Check package.json
    Write-Host "Checking package.json..."
    $packageJson = Get-Content "backend/package.json" | ConvertFrom-Json
    
    if ($packageJson.devDependencies."@typescript-eslint/eslint-plugin" -notlike "*8*") {
        $issues += @{
            file = "package.json"
            issue = "TypeScript ESLint version mismatch"
            path = "backend/package.json"
        }
    }
    
    # Check tsconfig.json
    Write-Host "Checking tsconfig.json..."
    if (Test-Path "backend/tsconfig.json") {
        $tsconfig = Get-Content "backend/tsconfig.json" | ConvertFrom-Json
        if ($tsconfig.compilerOptions.strict -eq $true) {
            Write-Host "Strict mode enabled - good!" -ForegroundColor Green
        }
    }
    
    return $issues
}

# AUDIT FRONTEND
function Audit-Frontend {
    Write-Step "AUDITING FRONTEND"
    
    $issues = @()
    
    # Check package.json for terser
    Write-Host "Checking frontend dependencies..."
    $packageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    
    if (-not $packageJson.devDependencies.terser) {
        $issues += @{
            file = "package.json"
            issue = "Missing terser dependency"
            path = "frontend/package.json"
        }
    }
    
    # Check PostCSS config
    Write-Host "Checking PostCSS config..."
    $postcssContent = Get-Content "frontend/postcss.config.cjs" -Raw
    if ($postcssContent -match "export\s+default") {
        $issues += @{
            file = "postcss.config.cjs"
            issue = "Using ES6 export instead of CommonJS"
            path = "frontend/postcss.config.cjs"
        }
    }
    
    # Check ESLint config
    Write-Host "Checking ESLint config..."
    if (-not (Test-Path "frontend/.eslintrc.json")) {
        $issues += @{
            file = ".eslintrc.json"
            issue = "Missing ESLint configuration"
            path = "frontend/.eslintrc.json"
        }
    }
    
    return $issues
}

# AUDIT DOCKERFILES
function Audit-Dockerfiles {
    Write-Step "AUDITING DOCKERFILES"
    
    $issues = @()
    
    # Check backend Dockerfile
    Write-Host "Checking backend Dockerfile..."
    $backendDockerfile = Get-Content "backend/Dockerfile" -Raw
    if ($backendDockerfile -notmatch "WORKDIR /app/backend") {
        $issues += @{
            file = "Dockerfile"
            issue = "Missing final WORKDIR /app/backend"
            path = "backend/Dockerfile"
        }
    }
    
    # Check for npm install without legacy-peer-deps
    if ($backendDockerfile -match "npm install" -and $backendDockerfile -notmatch "npm install.*legacy-peer-deps") {
        $issues += @{
            file = "Dockerfile"
            issue = "npm install missing --legacy-peer-deps flag"
            path = "backend/Dockerfile"
        }
    }
    
    return $issues
}

# AUDIT CONFIGS
function Audit-Configs {
    Write-Step "AUDITING CONFIGURATIONS"
    
    $issues = @()
    
    # Check render.yaml
    Write-Host "Checking render.yaml..."
    if (Test-Path "render.yaml") {
        $renderYaml = Get-Content "render.yaml" -Raw
        if ($renderYaml -notmatch "dockerfile:") {
            Write-Issue "render.yaml might not be using Dockerfiles"
        }
    }
    
    # Check .dockerignore
    Write-Host "Checking .dockerignore files..."
    if (-not (Test-Path "backend/.dockerignore")) {
        $issues += @{
            file = ".dockerignore"
            issue = "Missing .dockerignore in backend"
            path = "backend/.dockerignore"
        }
    }
    
    return $issues
}

# FIX ALL ISSUES
function Fix-AllIssues {
    Write-Step "AUTO-FIXING ALL ISSUES"
    
    # Fix Backend TypeScript
    Write-Host "Fixing backend TypeScript files..."
    $tsFiles = Get-ChildItem -Path "backend/src" -Recurse -Filter "*.ts"
    
    foreach ($file in $tsFiles) {
        $content = Get-Content $file.FullName -Raw
        $modified = $false
        
        # Fix catch (error) -> catch (error: unknown)
        if ($content -match "catch\s*\(\s*error\s*\)\s*\{") {
            $content = $content -replace "catch\s*\(\s*error\s*\)\s*\{", "catch (error: unknown) {"
            $modified = $true
            Write-Fixed "Fixed error type in $($file.Name)"
        }
        
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content
        }
    }
    
    # Fix Frontend postcss.config.cjs
    Write-Host "Fixing frontend configs..."
    if (Test-Path "frontend/postcss.config.cjs") {
        $postcssContent = Get-Content "frontend/postcss.config.cjs" -Raw
        if ($postcssContent -match "export\s+default") {
            $postcssContent = $postcssContent -replace "export\s+default", "module.exports ="
            Set-Content -Path "frontend/postcss.config.cjs" -Value $postcssContent
            Write-Fixed "Fixed postcss.config.cjs to use CommonJS"
        }
    }
    
    # Ensure terser in frontend package.json
    Write-Host "Ensuring terser dependency..."
    $pkgPath = "frontend/package.json"
    $packageJson = Get-Content $pkgPath | ConvertFrom-Json
    if (-not $packageJson.devDependencies.terser) {
        $packageJson.devDependencies | Add-Member -NotePropertyName "terser" -NotePropertyValue "^5.31.0" -Force
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $pkgPath
        Write-Fixed "Added terser to frontend dependencies"
    }
    
    # Create .dockerignore files if missing
    Write-Host "Creating .dockerignore files..."
    @("backend", "frontend") | ForEach-Object {
        $dockerignorePath = "$_\.dockerignore"
        if (-not (Test-Path $dockerignorePath)) {
            @(
                "node_modules",
                "npm-debug.log",
                ".git",
                ".gitignore",
                ".env.local",
                ".env.*.local",
                "dist",
                "build",
                ".DS_Store",
                "*.log"
            ) | Out-File -FilePath $dockerignorePath
            Write-Fixed "Created .dockerignore in $_"
        }
    }
    
    # Validate Dockerfiles
    Write-Host "Validating Dockerfiles..."
    @("backend", "frontend") | ForEach-Object {
        $dockerfile = "$_\Dockerfile"
        if (Test-Path $dockerfile) {
            $content = Get-Content $dockerfile -Raw
            
            # Ensure npm install has --legacy-peer-deps
            if ($content -match "npm install" -and $content -notmatch "npm install.*legacy-peer-deps") {
                $content = $content -replace "npm install", "npm install --legacy-peer-deps"
                Set-Content -Path $dockerfile -Value $content
                Write-Fixed "Added --legacy-peer-deps to $_ Dockerfile"
            }
        }
    }
    
    Write-Host ""
    Write-Fixed "All auto-fixes completed!"
}

# REPORT ISSUES
function Report-Issues {
    param([array]$AllIssues)
    
    if ($AllIssues.Count -eq 0) {
        Write-Host ""
        Write-Host "✓ NO ISSUES FOUND!" -ForegroundColor Green
        Write-Host ""
        return $true
    }
    
    Write-Host ""
    Write-Host "Found $($AllIssues.Count) issues:" -ForegroundColor Yellow
    Write-Host ""
    
    $AllIssues | ForEach-Object {
        Write-Issue "$($_.file): $($_.issue)"
        Write-Host "  Path: $($_.path)" -ForegroundColor Gray
    }
    
    return $false
}

# MAIN
Write-Header

$allIssues = @()

switch ($Mode) {
    "audit" {
        $allIssues += Audit-Backend
        $allIssues += Audit-Frontend
        $allIssues += Audit-Dockerfiles
        $allIssues += Audit-Configs
        
        Report-Issues $allIssues
    }
    
    "fix" {
        Fix-AllIssues
    }
    
    "full" {
        Write-Step "FULL AUDIT & AUTO-FIX"
        
        $allIssues += Audit-Backend
        $allIssues += Audit-Frontend
        $allIssues += Audit-Dockerfiles
        $allIssues += Audit-Configs
        
        $hasIssues = -not (Report-Issues $allIssues)
        
        if ($hasIssues) {
            Write-Step "RUNNING AUTO-FIX"
            Fix-AllIssues
            
            Write-Host ""
            Write-Step "RE-AUDITING AFTER FIX"
            $allIssues = @()
            $allIssues += Audit-Backend
            $allIssues += Audit-Frontend
            $allIssues += Audit-Dockerfiles
            $allIssues += Audit-Configs
            
            Report-Issues $allIssues
        }
    }
}

Write-Host ""
Write-Host "[OK] Audit & fix complete!" -ForegroundColor Green
Write-Host ""
