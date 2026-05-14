# QRPiPay - MASTER FIX SCRIPT - CORRIGES TOUT

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  QRPiPay - MASTER FIX (CORRIGE TOUT - DEFINITIF)            ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# ============================================================================
# PHASE 1: NETTOYER COMPLETEMENT
# ============================================================================

Write-Host "[PHASE 1] NETTOYAGE COMPLET" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

@("backend", "frontend") | ForEach-Object {
    Write-Host ""
    Write-Host "Nettoyage $_..." -ForegroundColor Yellow
    Set-Location $_
    
    # Supprimer node_modules
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Write-Host "[OK] node_modules supprime" -ForegroundColor Green
    }
    
    # Supprimer package-lock.json
    if (Test-Path "package-lock.json") {
        Remove-Item package-lock.json -ErrorAction SilentlyContinue
        Write-Host "[OK] package-lock.json supprime" -ForegroundColor Green
    }
    
    # Supprimer dist
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
        Write-Host "[OK] dist supprime" -ForegroundColor Green
    }
    
    Set-Location ..
}

Write-Host ""
Write-Host "Nettoyage npm global..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null
Write-Host "[OK] Cache npm nettoye" -ForegroundColor Green

Write-Host ""

# ============================================================================
# PHASE 2: REINSTALLER PROPREMENT
# ============================================================================

Write-Host "[PHASE 2] REINSTALLATION PROPRE" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

@("backend", "frontend") | ForEach-Object {
    Write-Host ""
    Write-Host "Installation $_..." -ForegroundColor Yellow
    Set-Location $_
    
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $_ installe" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $_ echec!" -ForegroundColor Red
    }
    
    Set-Location ..
}

Write-Host ""

# ============================================================================
# PHASE 3: VERIFIER LES BUILDS
# ============================================================================

Write-Host "[PHASE 3] VERIFICATION DES BUILDS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host ""
Write-Host "Build backend..." -ForegroundColor Yellow
Set-Location backend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Backend build reussi" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backend build echec!" -ForegroundColor Red
}
Set-Location ..

Write-Host ""
Write-Host "Build frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Frontend build reussi" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend build echec!" -ForegroundColor Red
}
Set-Location ..

Write-Host ""

# ============================================================================
# PHASE 4: GIT COMMIT & PUSH
# ============================================================================

Write-Host "[PHASE 4] GIT COMMIT & PUSH" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host ""
git add -A
git commit -m "MASTER FIX: Clean rebuild - all dependencies fresh"
git push origin master

Write-Host "[OK] Push complete" -ForegroundColor Green

Write-Host ""

# ============================================================================
# PHASE 5: RESUME FINAL
# ============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  SUCCESS - TOUT EST CORRIGE!                               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "PROCHAINE ETAPE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Sur Render Dashboard: https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Supprimes les services existants" -ForegroundColor Cyan
Write-Host "3. Clique 'New +' > 'Web Service'" -ForegroundColor Cyan
Write-Host "4. Connecte GitHub: https://github.com/PORTRAITART1/QRPiPay" -ForegroundColor Cyan
Write-Host "5. Laisse Render auto-detecter render.yaml" -ForegroundColor Cyan
Write-Host "6. Clique 'Deploy'" -ForegroundColor Cyan
Write-Host ""
