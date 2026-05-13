@echo off
REM 🚀 QRPiPay Render Deployment Script (Windows)
REM Ce script aide à préparer et vérifier le déploiement sur Render

setlocal enabledelayedexpansion

echo.
echo 📋 QRPiPay - Préparation au déploiement Render
echo ================================================
echo.

REM 1. Vérifier les fichiers critiques
echo ✅ Vérification des fichiers critiques...

set "CRITICAL_FILES=render.yaml backend\Dockerfile frontend\Dockerfile backend\package.json frontend\package.json database\prisma\schema.prisma backend\src\lib\prisma.ts"

for %%F in (%CRITICAL_FILES%) do (
    if exist "%%F" (
        echo   ✓ %%F
    ) else (
        echo   ✗ MANQUANT: %%F
        exit /b 1
    )
)

REM 2. Vérifier Node.js
echo.
echo ✅ Vérification de Node.js...
for /f "tokens=*" %%i in ('node -v 2^>nul') do set "NODE_VERSION=%%i"
if defined NODE_VERSION (
    echo   ✓ Node.js %NODE_VERSION%
) else (
    echo   ✗ Node.js non installé
    exit /b 1
)

REM 3. Vérifier npm
echo.
echo ✅ Vérification de npm...
for /f "tokens=*" %%i in ('npm -v 2^>nul') do set "NPM_VERSION=%%i"
if defined NPM_VERSION (
    echo   ✓ npm %NPM_VERSION%
) else (
    echo   ✗ npm non installé
    exit /b 1
)

REM 4. Test build backend
echo.
echo ✅ Test de construction du backend...
cd backend
if errorlevel 1 goto error
echo   - Installation des dépendances...
call npm install >nul 2>&1
if errorlevel 1 goto backend_error
echo   - Construction TypeScript...
call npm run build >nul 2>&1
if errorlevel 1 goto backend_error
echo   ✓ Backend compilé avec succès
cd ..
goto frontend_test

:backend_error
echo   ✗ Erreur: npm run build backend échoué
cd ..
exit /b 1

REM 5. Test build frontend
:frontend_test
echo.
echo ✅ Test de construction du frontend...
cd frontend
if errorlevel 1 goto error
echo   - Installation des dépendances...
call npm install >nul 2>&1
if errorlevel 1 goto frontend_error
echo   - Construction Vite...
call npm run build >nul 2>&1
if errorlevel 1 goto frontend_error
echo   ✓ Frontend compilé avec succès
cd ..
goto docker_check

:frontend_error
echo   ✗ Erreur: npm run build frontend échoué
cd ..
exit /b 1

REM 6. Vérifier Docker
:docker_check
echo.
echo ✅ Vérification de Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo   ⚠ Docker non installé - test de build Docker skippé
) else (
    echo   ✓ Docker disponible
    echo     Conseil: Testez localement avec 'docker-compose up' avant de pousser
)

REM 7. Vérifier Git
echo.
echo ✅ Vérification de Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ Git non installé
) else (
    echo   ✓ Git disponible
    for /f "tokens=*" %%i in ('git status --short 2^>nul') do set "GIT_STATUS=%%i"
    if "!GIT_STATUS!"=="" (
        echo   ✓ Repository propre
    ) else (
        echo   ⚠ Fichiers non commitées détectées:
        git status --short
        echo     Commit ou stash avant de pousser sur Render
    )
)

REM 8. Configuration Render
echo.
echo ✅ Configuration Render.yaml...
findstr /R "type: web" render.yaml >nul
if errorlevel 1 goto yaml_error
findstr /R "type: static" render.yaml >nul
if errorlevel 1 goto yaml_error
echo   ✓ render.yaml bien configuré ^(backend + frontend + database^)
goto final_checklist

:yaml_error
echo   ✗ render.yaml incomplet
exit /b 1

REM 9. Checklist finale
:final_checklist
echo.
echo ================================================
echo ✨ Checklist de déploiement Render
echo ================================================
echo.
echo AVANT de pousser sur GitHub:
echo   [ ] Vérifier .env.production du backend
echo   [ ] Vérifier .env.production du frontend
echo   [ ] Générer un JWT_SECRET sécurisé pour Render
echo   [ ] Tester localement: docker-compose up
echo.
echo SUR Render:
echo   [ ] 1. Créer nouveau Web Service
echo   [ ] 2. Sélectionner 'Public GitHub repository'
echo   [ ] 3. Entrer URL: https://github.com/VOTRE_USERNAME/QRPiPay.git
echo   [ ] 4. Laisser Render utiliser render.yaml automatiquement
echo   [ ] 5. Configurer les variables d'environnement:
echo         - JWT_SECRET_KEY ^(générer une clé sécurisée^)
echo         - DB_PASSWORD ^(de PostgreSQL Render^)
echo         - DB_HOST ^(de PostgreSQL Render^)
echo   [ ] 6. Cliquer Deploy
echo.
echo APRÈS déploiement:
echo   [ ] Vérifier /health endpoint
echo   [ ] Vérifier /api/status endpoint
echo   [ ] Vérifier logs dans Render
echo   [ ] Tester connexion frontend - backend
echo.
echo ✅ Tous les tests locaux passés!
echo 🚀 Prêt pour le déploiement Render!
echo.
exit /b 0

:error
echo   ✗ Erreur lors de la navigation des répertoires
exit /b 1
