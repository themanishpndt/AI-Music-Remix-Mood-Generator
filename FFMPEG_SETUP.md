# FFmpeg Installation Guide for Windows

FFmpeg is required for the Audio Remixer feature to process audio files (MP3, etc.).

## Quick Installation Methods

### Method 1: Using Chocolatey (Recommended)

1. **Install Chocolatey** (if not already installed):
   - Open PowerShell as Administrator
   - Run:
     ```powershell
     Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
     ```

2. **Install FFmpeg**:
   ```powershell
   choco install ffmpeg
   ```

3. **Verify Installation**:
   ```powershell
   ffmpeg -version
   ```

### Method 2: Manual Installation

1. **Download FFmpeg**:
   - Visit: https://ffmpeg.org/download.html
   - Click on "Windows builds from gyan.dev"
   - Download the "ffmpeg-release-essentials.zip"

2. **Extract and Install**:
   - Extract the ZIP file to `C:\ffmpeg`
   - The folder structure should be: `C:\ffmpeg\bin\ffmpeg.exe`

3. **Add to System PATH**:
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find and select "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\ffmpeg\bin`
   - Click "OK" on all dialogs

4. **Verify Installation**:
   - Open a NEW Command Prompt or PowerShell
   - Run:
     ```powershell
     ffmpeg -version
     ```

### Method 3: Using Scoop

1. **Install Scoop** (if not already installed):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install FFmpeg**:
   ```powershell
   scoop install ffmpeg
   ```

## Troubleshooting

### Error: "The system cannot find the file specified"
- This means FFmpeg is not installed or not in your PATH
- Follow one of the installation methods above
- Make sure to restart your terminal/IDE after installation

### FFmpeg installed but still not working
- Restart your Python application
- Restart your terminal/IDE
- Verify FFmpeg is in PATH: `where ffmpeg` (Windows)

### Alternative: Use WAV files only
- If you don't want to install FFmpeg, you can use WAV files
- Convert your audio files to WAV format before uploading
- WAV files work without FFmpeg

## After Installation

1. **Restart your Flask server**:
   - Stop the current server (Ctrl+C)
   - Run: `python app.py`
   - You should see: "✓ FFmpeg found at: [path]"

2. **Test the Remix Feature**:
   - Upload an audio file
   - Apply effects and remix
   - Download the result

## Need Help?

- FFmpeg Official Documentation: https://ffmpeg.org/documentation.html
- FFmpeg Windows Builds: https://www.gyan.dev/ffmpeg/builds/
