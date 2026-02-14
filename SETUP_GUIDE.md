# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Install Python Dependencies

Open a terminal in the project directory and run:

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2️⃣ Install Node.js Dependencies

In the same or a new terminal:

```bash
npm install
```

### 3️⃣ Start the Backend Server

In Terminal 1:

```bash
# Make sure venv is activated
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

### 4️⃣ Start the Frontend Server

In Terminal 2:

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 5️⃣ Open Your Browser

Navigate to: `http://localhost:5173`

## 🎵 First Steps

1. **Generate Music**:
   - Click "Generate Music" tab
   - Select a mood (e.g., "Happy")
   - Select a genre (e.g., "Electronic")
   - Click "Generate Music"
   - Wait a few seconds
   - Play your creation!

2. **Remix Audio**:
   - Click "Remix Audio" tab
   - Upload an audio file
   - Select target mood and genre
   - Adjust tempo if desired
   - Click "Remix Audio"
   - Listen to the transformation!

## ⚠️ Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
- **Solution**: Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Problem**: Port 5000 already in use
- **Solution**: Stop other applications using port 5000 or change the port in `app.py`

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: Make sure you have Node.js 16+ installed. Run `node --version` to check.

**Problem**: Port 5173 already in use
- **Solution**: The dev server will automatically try the next available port

### Audio Issues

**Problem**: No audio plays
- **Solution**: Check that the backend server is running and accessible at `http://localhost:5000`

**Problem**: File upload fails
- **Solution**: Ensure the file is a valid audio format (WAV, MP3, etc.)

## 📦 Dependencies Overview

### Python (Backend)
- `flask` - Web framework
- `flask-cors` - Enable CORS for API
- `pydub` - Audio manipulation
- `librosa` - Audio analysis
- `numpy` - Numerical operations
- `scipy` - Scientific computing

### Node.js (Frontend)
- `react` - UI framework
- `vite` - Build tool
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `axios` - HTTP requests

## 🎯 Quick Commands

```bash
# Backend
python app.py                    # Start backend server

# Frontend
npm run dev                      # Start dev server
npm run build                    # Build for production
npm run preview                  # Preview production build

# Both
# Run in separate terminals simultaneously
```

## 💡 Tips

1. **Keep both servers running** while using the application
2. **Backend must start first** before frontend can communicate with it
3. **Generated files** are saved in the `generated/` folder
4. **Uploaded files** are saved in the `uploads/` folder
5. **Clear browser cache** if you see old UI after updates

## 🎉 You're Ready!

Start creating amazing music with AI! 🎵
