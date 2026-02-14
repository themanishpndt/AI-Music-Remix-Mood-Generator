# FFmpeg Installation Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FFmpeg Installation for AI Music App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠ WARNING: This script should be run as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Check if FFmpeg is already installed
$ffmpegPath = Get-Command ffmpeg -ErrorAction SilentlyContinue

if ($ffmpegPath) {
    Write-Host "✓ FFmpeg is already installed!" -ForegroundColor Green
    Write-Host "  Location: $($ffmpegPath.Source)" -ForegroundColor Gray
    Write-Host ""
    ffmpeg -version | Select-Object -First 1
    Write-Host ""
    Write-Host "You're all set! You can close this window." -ForegroundColor Green
    exit 0
}

Write-Host "FFmpeg not found. Let's install it!" -ForegroundColor Yellow
Write-Host ""

# Check if Chocolatey is installed
$chocoPath = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoPath) {
    Write-Host "✓ Chocolatey is installed" -ForegroundColor Green
    Write-Host "Installing FFmpeg via Chocolatey..." -ForegroundColor Cyan
    Write-Host ""
    
    choco install ffmpeg -y
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ FFmpeg installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Please restart your terminal/IDE and run 'python app.py' again." -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "✗ Installation failed. Please try manual installation." -ForegroundColor Red
        Write-Host "See FFMPEG_SETUP.md for instructions." -ForegroundColor Yellow
    }
} else {
    Write-Host "Chocolatey is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Choose an installation method:" -ForegroundColor Cyan
    Write-Host "1. Install Chocolatey and FFmpeg (Recommended)" -ForegroundColor White
    Write-Host "2. Install Scoop and FFmpeg" -ForegroundColor White
    Write-Host "3. Manual installation instructions" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1-3)"
    
    switch ($choice) {
        "1" {
            Write-Host ""
            Write-Host "Installing Chocolatey..." -ForegroundColor Cyan
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            
            Write-Host ""
            Write-Host "Installing FFmpeg..." -ForegroundColor Cyan
            choco install ffmpeg -y
            
            Write-Host ""
            Write-Host "✓ Installation complete!" -ForegroundColor Green
            Write-Host "Please restart your terminal/IDE and run 'python app.py' again." -ForegroundColor Yellow
        }
        "2" {
            Write-Host ""
            Write-Host "Installing Scoop..." -ForegroundColor Cyan
            Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
            
            Write-Host ""
            Write-Host "Installing FFmpeg..." -ForegroundColor Cyan
            scoop install ffmpeg
            
            Write-Host ""
            Write-Host "✓ Installation complete!" -ForegroundColor Green
            Write-Host "Please restart your terminal/IDE and run 'python app.py' again." -ForegroundColor Yellow
        }
        "3" {
            Write-Host ""
            Write-Host "Manual Installation Steps:" -ForegroundColor Cyan
            Write-Host "1. Download FFmpeg from: https://ffmpeg.org/download.html" -ForegroundColor White
            Write-Host "2. Extract to C:\ffmpeg" -ForegroundColor White
            Write-Host "3. Add C:\ffmpeg\bin to your System PATH" -ForegroundColor White
            Write-Host "4. Restart your terminal/IDE" -ForegroundColor White
            Write-Host ""
            Write-Host "See FFMPEG_SETUP.md for detailed instructions." -ForegroundColor Yellow
        }
        default {
            Write-Host ""
            Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
