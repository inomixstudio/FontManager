@echo off
setlocal
cd /d "%~dp0"
set "PACKAGE=%USERPROFILE%\.nuget\packages\microsoft.web.webview2\1.0.4314.35"
set "CSC=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

if not exist "%CSC%" (
  echo Compiler .NET Framework tidak ditemukan.
  exit /b 1
)
if not exist "%PACKAGE%\lib\net462\Microsoft.Web.WebView2.WinForms.dll" (
  echo Paket Microsoft WebView2 tidak ditemukan di cache NuGet.
  echo Pasang Microsoft.Web.WebView2 versi 1.0.4314.35 lalu jalankan ulang.
  exit /b 1
)

if not exist "%~dp0app.ico" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0make-icon.ps1"
  if errorlevel 1 (
    echo Ikon aplikasi gagal dibuat.
    exit /b 1
  )
)

"%CSC%" /nologo /target:winexe /platform:x64 /optimize+ /out:"%~dp0FontManager.exe" /win32icon:"%~dp0app.ico" /reference:System.Windows.Forms.dll /reference:System.Drawing.dll /reference:"%PACKAGE%\lib\net462\Microsoft.Web.WebView2.Core.dll" /reference:"%PACKAGE%\lib\net462\Microsoft.Web.WebView2.WinForms.dll" "%~dp0FontManagerHost.cs"
if errorlevel 1 exit /b 1
copy /y "%PACKAGE%\lib\net462\Microsoft.Web.WebView2.Core.dll" "%~dp0" >nul
copy /y "%PACKAGE%\lib\net462\Microsoft.Web.WebView2.WinForms.dll" "%~dp0" >nul
copy /y "%PACKAGE%\runtimes\win-x64\native\WebView2Loader.dll" "%~dp0" >nul
echo FontManager.exe siap dibuat.
