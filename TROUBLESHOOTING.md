# Troubleshooting Guide

## Common Issues and Solutions

### 1. "[WinError 2] The system cannot find the file specified"

**Problem:** This error occurs when trying to remix audio files because FFmpeg is not installed.

**Solution:**
1. **Quick Fix (Windows):**
   - Right-click `INSTALL_FFMPEG.bat` and select "Run as Administrator"
   - Follow the installation wizard

2. **Manual Fix:**
   - Install FFmpeg using one of these methods:
     - Chocolatey: `choco install ffmpeg`
     - Scoop: `scoop install ffmpeg`
     - Manual: Download from https://ffmpeg.org/download.html
   - See [FFMPEG_SETUP.md](FFMPEG_SETUP.md) for detailed instructions

3. **Temporary Workaround:**
   - Use WAV files instead of MP3 (WAV files don't require FFmpeg)
   - Convert your audio files to WAV format before uploading

**Verification:**
```powershell
# Check if FFmpeg is installed
ffmpeg -version

# If you see version info, FFmpeg is installed correctly
```

---

### 2. Backend Server Won't Start

**Problem:** `python app.py` fails to start

**Solutions:**

**A. Virtual Environment Not Activated**
```bash
# Windows
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

**B. Missing Dependencies**
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

**C. Port Already in Use**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process using the port (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### 3. Frontend Won't Start

**Problem:** `npm run dev` fails

**Solutions:**

**A. Node Modules Not Installed**
```bash
npm install
```

**B. Port 5173 Already in Use**
- Vite will automatically try the next available port
- Check the terminal output for the actual port being used

**C. Clear Cache and Reinstall**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### 4. CORS Errors in Browser Console

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solutions:**

**A. Backend Not Running**
- Make sure `python app.py` is running in a separate terminal
- Backend should be at http://localhost:5000

**B. Wrong API URL**
- Check `src/components/MusicGenerator.jsx` and `AudioRemixer.jsx`
- API_URL should be `http://localhost:5000/api`

---

### 5. Audio Files Not Playing

**Problem:** Generated or remixed audio won't play

**Solutions:**

**A. Check Browser Console**
- Press F12 to open Developer Tools
- Look for error messages in the Console tab

**B. File Not Generated**
- Check the `generated/` folder
- Make sure the file exists

**C. Browser Audio Support**
- Try a different browser (Chrome, Firefox, Edge)
- Clear browser cache

---

### 6. "Module Not Found" Errors

**Problem:** Python import errors

**Solution:**
```bash
# Activate virtual environment first
venv\Scripts\activate

# Reinstall all dependencies
pip install -r requirements.txt

# If specific package is missing
pip install <package-name>
```

---

### 7. Slow Audio Generation

**Problem:** Music generation takes too long

**Reasons:**
- Longer duration (20-30 seconds takes more time)
- Complex genre effects
- First-time library loading

**Solutions:**
- Start with shorter durations (5-10 seconds)
- Be patient - complex audio processing takes time
- Upgrade your hardware if consistently slow

---

### 8. Upload File Size Limit

**Problem:** "File too large" error

**Solution:**
- Maximum file size is typically 16MB (Flask default)
- Compress your audio file
- Use a shorter audio clip

---

### 9. FFmpeg Installed But Still Not Working

**Problem:** FFmpeg is installed but app still shows error

**Solutions:**

**A. Restart Everything**
1. Close all terminals
2. Close your IDE
3. Open a new terminal
4. Verify FFmpeg: `ffmpeg -version`
5. Restart the Flask server: `python app.py`

**B. Check PATH**
```powershell
# Windows - Check if FFmpeg is in PATH
where ffmpeg

# Should show the path to ffmpeg.exe
```

**C. Reinstall FFmpeg**
```powershell
# Using Chocolatey
choco uninstall ffmpeg
choco install ffmpeg
```

---

### 10. Virtual Environment Issues

**Problem:** Can't activate virtual environment

**Solutions:**

**A. Execution Policy (Windows)**
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**B. Recreate Virtual Environment**
```bash
# Delete old venv
rm -rf venv

# Create new one
python -m venv venv

# Activate
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

---

## Getting More Help

### Check Logs

**Backend Logs:**
- Look at the terminal where `python app.py` is running
- Error messages will appear here

**Frontend Logs:**
- Open Browser Developer Tools (F12)
- Check the Console tab for errors

### Verify Installation

**Check Python:**
```bash
python --version
# Should be 3.8 or higher
```

**Check Node.js:**
```bash
node --version
# Should be 16 or higher
```

**Check FFmpeg:**
```bash
ffmpeg -version
# Should show FFmpeg version info
```

**Check Dependencies:**
```bash
# Python packages
pip list

# Node packages
npm list --depth=0
```

### Clean Install

If all else fails, try a clean installation:

```bash
# 1. Delete virtual environment
rm -rf venv

# 2. Delete node_modules
rm -rf node_modules package-lock.json

# 3. Recreate virtual environment
python -m venv venv
venv\Scripts\activate

# 4. Reinstall Python dependencies
pip install -r requirements.txt

# 5. Reinstall Node dependencies
npm install

# 6. Install FFmpeg
# Right-click INSTALL_FFMPEG.bat and run as Administrator

# 7. Start backend
python app.py

# 8. Start frontend (in new terminal)
npm run dev
```

---

## Still Having Issues?

1. **Check the README.md** for setup instructions
2. **Review FFMPEG_SETUP.md** for FFmpeg-specific help
3. **Look at error messages carefully** - they often tell you exactly what's wrong
4. **Try the clean install** procedure above
5. **Check your firewall/antivirus** - they might be blocking the servers

---

**Remember:** Most issues are caused by:
- Missing FFmpeg installation
- Virtual environment not activated
- Dependencies not installed
- Servers not running
