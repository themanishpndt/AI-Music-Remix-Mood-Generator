@echo off
echo ========================================
echo   FFmpeg Installation Helper
echo ========================================
echo.
echo This will install FFmpeg for the Audio Remixer feature.
echo.
echo Right-click this file and select "Run as Administrator"
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0install_ffmpeg.ps1"

pause
