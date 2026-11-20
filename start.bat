@echo off
title Dunia Kenangan Kita - Ulang Tahun ke-24 ❤️
echo ========================================================
echo   Selamat Ulang Tahun ke-24, Sayang! ❤️
echo   Membuka Dunia Kenangan Kita...
echo ========================================================
echo.

REM Cek apakah Python terpasang
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Menjalankan local server via Python...
    start "" http://localhost:8080
    python -m http.server 8080
    goto end
)

REM Fallback: Cek Node.js npx serve
npx --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Menjalankan local server via Node.js...
    npx serve -l 8080
    goto end
)

REM Fallback jika tidak ada server: buka langsung di browser
echo Membuka langsung index.html di browser...
start "" index.html

:end
pause
