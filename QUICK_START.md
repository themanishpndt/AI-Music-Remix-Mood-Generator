# 🚀 Quick Start Guide

## Fix the FFmpeg Error NOW

You're seeing the error: **"[WinError 2] The system cannot find the file specified"**

This means FFmpeg is not installed. Here's how to fix it:

---

## ⚡ Fastest Solution (2 minutes)

### Step 1: Install FFmpeg

**Right-click** the file `INSTALL_FFMPEG.bat` in this folder and select **"Run as Administrator"**

The script will:
- Check if FFmpeg is already installed
- Guide you through automatic installation
- Verify the installation

### Step 2: Restart Your Server

After FFmpeg is installed:

1. **Stop the Flask server** (press Ctrl+C in the terminal running `python app.py`)
2. **Start it again:**
   ```bash
   python app.py
   ```
3. You should see: **"✓ FFmpeg found at: [path]"**

### Step 3: Test the Remix Feature

1. Go to http://localhost:5173
2. Click on "Audio Remixer" tab
3. Upload an audio file
4. Click "Remix Audio"
5. It should work now! 🎉

---

## 🔄 Alternative: Use WAV Files Only

If you don't want to install FFmpeg right now:

1. Convert your audio files to WAV format
2. Upload WAV files to the remixer
3. WAV files work without FFmpeg

**Online converters:**
- https://cloudconvert.com/mp3-to-wav
- https://online-audio-converter.com/

---

## 📋 Manual Installation (if script doesn't work)

### Option 1: Using Chocolatey

```powershell
# Open PowerShell as Administrator
choco install ffmpeg
```

### Option 2: Using Scoop

```powershell
# Open PowerShell
scoop install ffmpeg
```

### Option 3: Manual Download

1. Go to https://ffmpeg.org/download.html
2. Click "Windows builds from gyan.dev"
3. Download "ffmpeg-release-essentials.zip"
4. Extract to `C:\ffmpeg`
5. Add `C:\ffmpeg\bin` to your System PATH
6. Restart your terminal

**Detailed instructions:** See [FFMPEG_SETUP.md](FFMPEG_SETUP.md)

---

## ✅ Verify Installation

Open a **new** terminal and run:

```powershell
ffmpeg -version
```

If you see version information, FFmpeg is installed correctly!

---

## 🎵 What You Can Do After Installation

### Music Generator (No FFmpeg needed)
- Generate music from scratch
- Choose mood and genre
- Adjust tempo and duration
- Works without FFmpeg!

### Audio Remixer (Requires FFmpeg)
- Upload MP3, WAV, or other audio files
- Transform mood and genre
- Adjust tempo (0.5x to 2.0x)
- Apply AI-powered effects

---

## 🆘 Still Having Issues?

1. **Check if FFmpeg is in PATH:**
   ```powershell
   where ffmpeg
   ```
   Should show the path to ffmpeg.exe

2. **Restart everything:**
   - Close all terminals
   - Close your IDE
   - Open new terminal
   - Run `python app.py` again

3. **Check the logs:**
   - Look at the terminal where `python app.py` is running
   - Should show "✓ FFmpeg found at: [path]"

4. **Read the full troubleshooting guide:**
   - See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📞 Quick Reference

| Issue | Solution |
|-------|----------|
| FFmpeg not found | Run `INSTALL_FFMPEG.bat` as Administrator |
| Still not working after install | Restart terminal and Flask server |
| Don't want to install FFmpeg | Use WAV files only |
| Need detailed help | See [FFMPEG_SETUP.md](FFMPEG_SETUP.md) |
| Other issues | See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

---

**You're almost there! Just install FFmpeg and you'll be remixing music in minutes! 🎵**
