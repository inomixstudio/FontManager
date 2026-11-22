@echo off
setlocal
title Font Manager
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js tidak ditemukan.
  echo   Instal Node.js 18 atau lebih baru dari https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "desktop\FontManager.exe" (
  echo.
  echo   Membuat aplikasi desktop pertama kali...
  call desktop\build-desktop.bat
  if errorlevel 1 (
    echo.
    echo   Aplikasi desktop gagal dibuat.
    pause
    exit /b 1
  )
)

if not exist "desktop\Microsoft.Web.WebView2.Core.dll" (
  echo.
  echo   Komponen WebView2 desktop tidak lengkap.
  echo   Jalankan desktop\build-desktop.bat kembali.
  echo.
  pause
  exit /b 1
)

echo Menjalankan Font Manager...
start "" "%~dp0desktop\FontManager.exe"
