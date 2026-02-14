# FFmpeg Setup Script
# This script will download and install FFmpeg automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FFmpeg Automatic Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠ This script needs Administrator privileges to modify PATH" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Download FFmpeg
$downloadUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$downloadPath = "$env:TEMP\ffmpeg-essentials.zip"
$extractPath = "C:\ffmpeg"

Write-Host "Downloading FFmpeg..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "✓ Download complete" -ForegroundColor Green
} catch {
    Write-Host "✗ Download failed: $_" -ForegroundColor Red
    pause
    exit
}

# Extract
Write-Host "Extracting FFmpeg..." -ForegroundColor Cyan
try {
    Expand-Archive -Path $downloadPath -DestinationPath $env:TEMP -Force
    
    # Find the extracted folder
    $extractedFolder = Get-ChildItem -Path $env:TEMP -Filter "ffmpeg-*-essentials_build" -Directory | Select-Object -First 1
    
    if ($extractedFolder) {
        # Create C:\ffmpeg if it doesn't exist
        if (-not (Test-Path $extractPath)) {
            New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
        }
        
        # Move contents
        Copy-Item -Path "$($extractedFolder.FullName)\*" -Destination $extractPath -Recurse -Force
        Write-Host "✓ Extraction complete" -ForegroundColor Green
    } else {
        Write-Host "✗ Could not find extracted folder" -ForegroundColor Red
        pause
        exit
    }
} catch {
    Write-Host "✗ Extraction failed: $_" -ForegroundColor Red
    pause
    exit
}

# Add to PATH
Write-Host "Adding to System PATH..." -ForegroundColor Cyan
try {
    $ffmpegBinPath = "$extractPath\bin"
    
    # Get current PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    
    # Check if already in PATH
    if ($currentPath -notlike "*$ffmpegBinPath*") {
        # Add to PATH
        $newPath = "$currentPath;$ffmpegBinPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "✓ Added to System PATH" -ForegroundColor Green
    } else {
        Write-Host "✓ Already in System PATH" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Failed to add to PATH: $_" -ForegroundColor Red
    Write-Host "You may need to add manually: $extractPath\bin" -ForegroundColor Yellow
}

# Cleanup
Write-Host "Cleaning up..." -ForegroundColor Cyan
Remove-Item -Path $downloadPath -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\ffmpeg-*-essentials_build" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ FFmpeg Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "FFmpeg installed to: $extractPath" -ForegroundColor White
Write-Host "FFmpeg bin path: $extractPath\bin" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Please restart your terminal/IDE for PATH changes to take effect" -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify installation, open a NEW terminal and run:" -ForegroundColor Cyan
Write-Host "  ffmpeg -version" -ForegroundColor White
Write-Host ""
pause
