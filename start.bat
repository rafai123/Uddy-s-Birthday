@echo off
title Dunia Kenangan Kita - Ulang Tahun ke-24 (Retro Forgotten Warrior Style)
echo ========================================================
echo   Selamat Ulang Tahun ke-24, Sayang! ❤️
echo   Dunia Kenangan Kita - Retro Game Edition
echo ========================================================
echo.

REM Prioritas 1: Gunakan Node.js (Tanpa Python)
node -v >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Menjalankan server JavaScript modern via Node.js...
    start "" http://localhost:8080
    node server.js
    goto end
)

REM Prioritas 2: Fallback buka langsung index.html di browser
echo Node.js tidak ditemukan, membuka langsung index.html di peramban...
start "" index.html

:end
pause
