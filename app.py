from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import numpy as np
import librosa
import soundfile as sf
from pydub import AudioSegment
from pydub.generators import Sine, Square, Sawtooth, Triangle
from pydub.utils import which
import io
import json
from datetime import datetime
import random
import sys

app = Flask(__name__)
CORS(app)

# Create directories for uploads and generated files
UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# Set FFmpeg path explicitly
FFMPEG_PATH = r"C:\Users\MANISH SHARMA\Downloads\ffmpeg-8.0-essentials_build\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"
if os.path.exists(FFMPEG_PATH):
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffmpeg = FFMPEG_PATH
    AudioSegment.ffprobe = FFMPEG_PATH.replace("ffmpeg.exe", "ffprobe.exe")

# Check for FFmpeg installation
def check_ffmpeg():
    """Check if FFmpeg is installed and accessible"""
    # First check explicit path
    if os.path.exists(FFMPEG_PATH):
        print(f"✓ FFmpeg found at: {FFMPEG_PATH}")
        return True
    
    # Then check system PATH
    ffmpeg_path = which("ffmpeg")
    if ffmpeg_path:
        print(f"✓ FFmpeg found at: {ffmpeg_path}")
        return True
    else:
        print("⚠ WARNING: FFmpeg not found!")
        print("  FFmpeg is required for audio file conversion (MP3, etc.)")
        print("  Download from: https://ffmpeg.org/download.html")
        print("  Or install via: choco install ffmpeg (Windows)")
        return False

# Check FFmpeg on startup
FFMPEG_AVAILABLE = check_ffmpeg()

# Mood to musical parameters mapping
MOOD_PRESETS = {
    'happy': {
        'tempo_range': (120, 140),
        'key': 'major',
        'brightness': 0.8,
        'energy': 0.9,
        'notes': [0, 2, 4, 5, 7, 9, 11]  # Major scale
    },
    'sad': {
        'tempo_range': (60, 80),
        'key': 'minor',
        'brightness': 0.3,
        'energy': 0.4,
        'notes': [0, 2, 3, 5, 7, 8, 10]  # Natural minor scale
    },
    'energetic': {
        'tempo_range': (140, 180),
        'key': 'major',
        'brightness': 0.9,
        'energy': 1.0,
        'notes': [0, 2, 4, 5, 7, 9, 11]
    },
    'calm': {
        'tempo_range': (70, 90),
        'key': 'major',
        'brightness': 0.6,
        'energy': 0.5,
        'notes': [0, 2, 4, 7, 9]  # Pentatonic
    },
    'dark': {
        'tempo_range': (80, 100),
        'key': 'minor',
        'brightness': 0.2,
        'energy': 0.6,
        'notes': [0, 2, 3, 5, 7, 8, 11]  # Harmonic minor
    },
    'uplifting': {
        'tempo_range': (110, 130),
        'key': 'major',
        'brightness': 0.85,
        'energy': 0.8,
        'notes': [0, 2, 4, 5, 7, 9, 11]
    }
}

GENRE_PRESETS = {
    'electronic': {
        'waveform': 'square',
        'effects': ['reverb', 'filter'],
        'rhythm_pattern': [1, 0, 1, 0, 1, 0, 1, 0]
    },
    'ambient': {
        'waveform': 'sine',
        'effects': ['reverb', 'delay'],
        'rhythm_pattern': [1, 0, 0, 0, 1, 0, 0, 0]
    },
    'rock': {
        'waveform': 'sawtooth',
        'effects': ['distortion'],
        'rhythm_pattern': [1, 0, 1, 1, 1, 0, 1, 1]
    },
    'classical': {
        'waveform': 'sine',
        'effects': ['reverb'],
        'rhythm_pattern': [1, 0, 0, 1, 0, 0, 1, 0]
    },
    'jazz': {
        'waveform': 'triangle',
        'effects': ['reverb'],
        'rhythm_pattern': [1, 0, 1, 1, 0, 1, 1, 0]
    }
}

def generate_tone(frequency, duration, waveform='sine', sample_rate=44100):
    """Generate a tone with specified waveform"""
    duration_ms = int(duration * 1000)
    
    if waveform == 'sine':
        tone = Sine(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'square':
        tone = Square(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'sawtooth':
        tone = Sawtooth(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'triangle':
        tone = Triangle(frequency).to_audio_segment(duration=duration_ms)
    else:
        tone = Sine(frequency).to_audio_segment(duration=duration_ms)
    
    return tone

def note_to_frequency(note, octave=4):
    """Convert note number to frequency (A4 = 440Hz)"""
    # C4 is MIDI note 60
    midi_note = 60 + note + (octave - 4) * 12
    frequency = 440 * (2 ** ((midi_note - 69) / 12))
    return frequency

def generate_melody(mood_preset, genre_preset, duration=10, tempo=120):
    """Generate a melody based on mood and genre"""
    notes = mood_preset['notes']
    waveform = genre_preset['waveform']
    rhythm_pattern = genre_preset['rhythm_pattern']
    
    # Calculate beat duration
    beat_duration = 60 / tempo  # seconds per beat
    
    # Generate melody
    melody = AudioSegment.silent(duration=0)
    
    current_time = 0
    pattern_index = 0
    
    while current_time < duration:
        # Check if we should play a note based on rhythm pattern
        if rhythm_pattern[pattern_index % len(rhythm_pattern)] == 1:
            # Choose a random note from the scale
            note = random.choice(notes)
            octave = random.choice([3, 4, 5])
            frequency = note_to_frequency(note, octave)
            
            # Generate note
            note_duration = beat_duration * random.choice([0.25, 0.5, 1.0])
            tone = generate_tone(frequency, note_duration, waveform)
            
            # Apply envelope (fade in/out)
            tone = tone.fade_in(50).fade_out(50)
            
            # Adjust volume based on energy
            volume_adjustment = -20 + (mood_preset['energy'] * 15)
            tone = tone + volume_adjustment
            
            melody = melody + tone
        else:
            # Rest
            rest_duration = int(beat_duration * 1000)
            melody = melody + AudioSegment.silent(duration=rest_duration)
        
        current_time += beat_duration
        pattern_index += 1
    
    # Trim to exact duration
    melody = melody[:duration * 1000]
    
    return melody

def add_bass_line(melody, mood_preset, genre_preset, tempo=120):
    """Add a bass line to the melody"""
    notes = mood_preset['notes']
    waveform = 'sine'  # Bass is usually sine wave
    
    beat_duration = 60 / tempo
    duration = len(melody) / 1000  # Convert to seconds
    
    bass = AudioSegment.silent(duration=0)
    current_time = 0
    
    while current_time < duration:
        # Bass plays root notes
        note = notes[0]  # Root note
        octave = 2  # Low octave for bass
        frequency = note_to_frequency(note, octave)
        
        note_duration = beat_duration * 2  # Longer notes for bass
        tone = generate_tone(frequency, note_duration, waveform)
        
        # Bass is quieter
        tone = tone - 10
        tone = tone.fade_in(100).fade_out(100)
        
        bass = bass + tone
        current_time += beat_duration * 2
    
    # Trim to match melody length
    bass = bass[:len(melody)]
    
    return bass

def apply_effects(audio, effects, mood_preset):
    """Apply audio effects"""
    result = audio
    
    if 'reverb' in effects:
        # Enhanced reverb with multiple delays
        delay_times = [100, 200, 300]  # ms
        for i, delay_time in enumerate(delay_times):
            decay = 0.4 - (i * 0.1)
            delayed = AudioSegment.silent(duration=delay_time) + audio
            delayed = delayed - (10 + i * 5)  # Progressive volume reduction
            result = result.overlay(delayed)
    
    if 'delay' in effects:
        # Echo effect
        delay_time = 400
        delayed = AudioSegment.silent(duration=delay_time) + audio
        delayed = delayed - 12
        result = result.overlay(delayed)
    
    if 'filter' in effects:
        # Brightness-based filtering
        brightness = mood_preset['brightness']
        if brightness < 0.5:
            result = result.low_pass_filter(3000)
        else:
            result = result.high_pass_filter(100)
    
    if 'distortion' in effects:
        # Simulate distortion by boosting and compressing
        result = result + 10  # Boost
        result = result.compress_dynamic_range(threshold=-20.0, ratio=4.0)
    
    return result

def pitch_shift_audio(audio, semitones):
    """Shift pitch of audio by semitones using frame rate manipulation"""
    if semitones == 0:
        return audio
    
    # Calculate new frame rate (pitch shift)
    shift_factor = 2 ** (semitones / 12.0)
    new_frame_rate = int(audio.frame_rate * shift_factor)
    
    # Apply pitch shift
    shifted = audio._spawn(audio.raw_data, overrides={'frame_rate': new_frame_rate})
    shifted = shifted.set_frame_rate(audio.frame_rate)
    
    return shifted

def time_stretch_audio(audio, rate):
    """Stretch or compress audio duration without changing pitch"""
    if rate == 1.0:
        return audio
    
    # Export to numpy for processing
    samples = np.array(audio.get_array_of_samples())
    
    # Simple time stretching using interpolation
    original_length = len(samples)
    new_length = int(original_length / rate)
    
    # Resample
    indices = np.linspace(0, original_length - 1, new_length)
    stretched_samples = np.interp(indices, np.arange(original_length), samples)
    
    # Convert back to AudioSegment
    stretched_samples = stretched_samples.astype(np.int16)
    stretched = audio._spawn(stretched_samples.tobytes())
    
    return stretched

def analyze_audio_features(audio):
    """Analyze audio to extract musical features"""
    # Convert to numpy array
    samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
    samples = samples / np.max(np.abs(samples))  # Normalize
    
    # Calculate features
    rms_energy = np.sqrt(np.mean(samples ** 2))
    zero_crossing_rate = np.sum(np.abs(np.diff(np.sign(samples)))) / (2 * len(samples))
    
    # Estimate tempo from energy peaks
    frame_size = 2048
    hop_size = 512
    energy_frames = []
    
    for i in range(0, len(samples) - frame_size, hop_size):
        frame = samples[i:i + frame_size]
        energy_frames.append(np.sum(frame ** 2))
    
    energy_frames = np.array(energy_frames)
    
    return {
        'energy': float(rms_energy),
        'brightness': float(zero_crossing_rate),
        'dynamic_range': float(np.max(samples) - np.min(samples))
    }

def intelligent_mood_transform(audio, source_mood, target_mood, mood_presets):
    """Transform audio from one mood to another using AI-like processing"""
    source_preset = mood_presets[source_mood]
    target_preset = mood_presets[target_mood]
    
    result = audio
    
    # Adjust energy (volume and dynamics)
    energy_diff = target_preset['energy'] - source_preset['energy']
    if energy_diff > 0:
        result = result + (energy_diff * 10)  # Boost
    else:
        result = result + (energy_diff * 10)  # Reduce
    
    # Adjust brightness (filtering)
    brightness_diff = target_preset['brightness'] - source_preset['brightness']
    if brightness_diff > 0.2:
        # Make brighter - high-pass filter
        result = result.high_pass_filter(200)
    elif brightness_diff < -0.2:
        # Make darker - low-pass filter
        result = result.low_pass_filter(4000)
    
    # Adjust tempo if needed
    source_tempo_avg = sum(source_preset['tempo_range']) / 2
    target_tempo_avg = sum(target_preset['tempo_range']) / 2
    tempo_ratio = target_tempo_avg / source_tempo_avg
    
    if abs(tempo_ratio - 1.0) > 0.1:
        # Apply tempo change
        new_frame_rate = int(result.frame_rate * tempo_ratio)
        result = result._spawn(result.raw_data, overrides={'frame_rate': new_frame_rate})
        result = result.set_frame_rate(44100)
    
    return result

def add_harmony(audio, harmony_type='third'):
    """Add harmonic layer to audio"""
    if harmony_type == 'third':
        # Add major third (4 semitones up)
        harmony = pitch_shift_audio(audio, 4)
    elif harmony_type == 'fifth':
        # Add perfect fifth (7 semitones up)
        harmony = pitch_shift_audio(audio, 7)
    elif harmony_type == 'octave':
        # Add octave
        harmony = pitch_shift_audio(audio, 12)
    else:
        return audio
    
    # Mix with original (harmony quieter)
    harmony = harmony - 8
    result = audio.overlay(harmony)
    
    return result

def create_layered_mix(audio, layers_config):
    """Create layered mix with multiple effects"""
    result = audio
    
    for layer in layers_config:
        layer_audio = audio
        
        # Apply layer-specific transformations
        if 'pitch_shift' in layer:
            layer_audio = pitch_shift_audio(layer_audio, layer['pitch_shift'])
        
        if 'volume' in layer:
            layer_audio = layer_audio + layer['volume']
        
        if 'delay' in layer:
            delay_ms = layer['delay']
            layer_audio = AudioSegment.silent(duration=delay_ms) + layer_audio
        
        # Mix with result
        result = result.overlay(layer_audio)
    
    return result

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'AI Music Generator is running'})

@app.route('/api/moods', methods=['GET'])
def get_moods():
    """Get available moods"""
    moods = list(MOOD_PRESETS.keys())
    return jsonify({'moods': moods})

@app.route('/api/genres', methods=['GET'])
def get_genres():
    """Get available genres"""
    genres = list(GENRE_PRESETS.keys())
    return jsonify({'genres': genres})

@app.route('/api/generate', methods=['POST'])
def generate_music():
    """Generate music based on mood and genre"""
    try:
        data = request.json
        mood = data.get('mood', 'happy')
        genre = data.get('genre', 'electronic')
        duration = int(data.get('duration', 10))
        tempo = int(data.get('tempo', 120))
        
        # Validate inputs
        if mood not in MOOD_PRESETS:
            return jsonify({'error': 'Invalid mood'}), 400
        if genre not in GENRE_PRESETS:
            return jsonify({'error': 'Invalid genre'}), 400
        
        # Limit duration
        duration = min(duration, 30)
        
        # Get presets
        mood_preset = MOOD_PRESETS[mood]
        genre_preset = GENRE_PRESETS[genre]
        
        # Adjust tempo based on mood if not specified
        if 'tempo' not in data:
            tempo_min, tempo_max = mood_preset['tempo_range']
            tempo = random.randint(tempo_min, tempo_max)
        
        # Generate melody
        melody = generate_melody(mood_preset, genre_preset, duration, tempo)
        
        # Add bass line
        bass = add_bass_line(melody, mood_preset, genre_preset, tempo)
        
        # Mix melody and bass
        music = melody.overlay(bass)
        
        # Apply effects
        effects = genre_preset['effects']
        music = apply_effects(music, effects, mood_preset)
        
        # Normalize audio
        music = music.normalize()
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'generated_{mood}_{genre}_{timestamp}.wav'
        filepath = os.path.join(GENERATED_FOLDER, filename)
        
        # Export audio
        music.export(filepath, format='wav')
        
        return jsonify({
            'success': True,
            'filename': filename,
            'mood': mood,
            'genre': genre,
            'tempo': tempo,
            'duration': duration
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/remix', methods=['POST'])
def remix_audio():
    """Apply AI-powered remix effects to uploaded audio"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        mood = request.form.get('mood', 'happy')
        genre = request.form.get('genre', 'electronic')
        tempo_change = float(request.form.get('tempo_change', 1.0))
        pitch_shift = int(request.form.get('pitch_shift', 0))
        add_harmony_layer = request.form.get('add_harmony', 'false').lower() == 'true'
        harmony_type = request.form.get('harmony_type', 'third')
        intelligent_transform = request.form.get('intelligent_transform', 'false').lower() == 'true'
        source_mood = request.form.get('source_mood', 'happy')
        
        # Get original filename and extension
        original_filename = audio_file.filename
        file_extension = os.path.splitext(original_filename)[1].lower()
        
        # Check if FFmpeg is needed for this file type
        if file_extension not in ['.wav'] and not FFMPEG_AVAILABLE:
            return jsonify({
                'error': 'FFmpeg is required for this file format. Please install FFmpeg or use WAV files.',
                'ffmpeg_required': True,
                'install_url': 'https://ffmpeg.org/download.html'
            }), 400
        
        # Save uploaded file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        upload_filename = f'upload_{timestamp}{file_extension}'
        upload_path = os.path.join(UPLOAD_FOLDER, upload_filename)
        audio_file.save(upload_path)
        
        # Load audio with better error handling
        try:
            audio = AudioSegment.from_file(upload_path)
        except FileNotFoundError as e:
            return jsonify({
                'error': 'FFmpeg not found. Please install FFmpeg to process audio files.',
                'ffmpeg_required': True,
                'install_url': 'https://ffmpeg.org/download.html',
                'details': str(e)
            }), 500
        
        # Analyze original audio features
        audio_features = analyze_audio_features(audio)
        
        # Apply intelligent mood transformation if requested
        if intelligent_transform:
            audio = intelligent_mood_transform(audio, source_mood, mood, MOOD_PRESETS)
        
        # Apply pitch shift if requested
        if pitch_shift != 0:
            audio = pitch_shift_audio(audio, pitch_shift)
        
        # Apply tempo change
        if tempo_change != 1.0:
            new_sample_rate = int(audio.frame_rate * tempo_change)
            audio = audio._spawn(audio.raw_data, overrides={'frame_rate': new_sample_rate})
            audio = audio.set_frame_rate(44100)
        
        # Get presets
        mood_preset = MOOD_PRESETS.get(mood, MOOD_PRESETS['happy'])
        genre_preset = GENRE_PRESETS.get(genre, GENRE_PRESETS['electronic'])
        
        # Apply genre effects
        effects = genre_preset['effects']
        audio = apply_effects(audio, effects, mood_preset)
        
        # Add harmony layer if requested
        if add_harmony_layer:
            audio = add_harmony(audio, harmony_type)
        
        # Adjust brightness based on mood
        brightness = mood_preset['brightness']
        if brightness < 0.5:
            audio = audio.low_pass_filter(4000)
        elif brightness > 0.7:
            audio = audio.high_pass_filter(150)
        
        # Normalize
        audio = audio.normalize()
        
        # Save remixed audio
        remix_filename = f'remix_{mood}_{genre}_{timestamp}.wav'
        remix_path = os.path.join(GENERATED_FOLDER, remix_filename)
        audio.export(remix_path, format='wav')
        
        return jsonify({
            'success': True,
            'filename': remix_filename,
            'mood': mood,
            'genre': genre,
            'audio_features': audio_features,
            'applied_effects': {
                'pitch_shift': pitch_shift,
                'tempo_change': tempo_change,
                'harmony': harmony_type if add_harmony_layer else None,
                'intelligent_transform': intelligent_transform
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_audio():
    """Analyze uploaded audio and suggest creative transformations"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save uploaded file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_extension = os.path.splitext(audio_file.filename)[1].lower()
        upload_filename = f'analyze_{timestamp}{file_extension}'
        upload_path = os.path.join(UPLOAD_FOLDER, upload_filename)
        audio_file.save(upload_path)
        
        # Load audio
        try:
            audio = AudioSegment.from_file(upload_path)
        except FileNotFoundError:
            return jsonify({
                'error': 'FFmpeg required for this file format',
                'ffmpeg_required': True
            }), 500
        
        # Analyze features
        features = analyze_audio_features(audio)
        
        # Suggest moods based on features
        suggested_moods = []
        if features['energy'] > 0.6:
            suggested_moods.append('energetic')
        elif features['energy'] < 0.3:
            suggested_moods.append('calm')
        
        if features['brightness'] < 0.3:
            suggested_moods.append('dark')
        elif features['brightness'] > 0.5:
            suggested_moods.append('uplifting')
        
        # Suggest genres
        suggested_genres = []
        if features['energy'] > 0.7:
            suggested_genres.append('rock')
            suggested_genres.append('electronic')
        else:
            suggested_genres.append('ambient')
            suggested_genres.append('classical')
        
        # Creative suggestions
        suggestions = [
            {
                'name': 'Energize',
                'description': 'Speed up and brighten the track',
                'params': {'tempo_change': 1.2, 'pitch_shift': 2, 'mood': 'energetic'}
            },
            {
                'name': 'Chill Out',
                'description': 'Slow down and add ambient effects',
                'params': {'tempo_change': 0.8, 'mood': 'calm', 'genre': 'ambient'}
            },
            {
                'name': 'Add Harmony',
                'description': 'Layer harmonic vocals or instruments',
                'params': {'add_harmony': True, 'harmony_type': 'third'}
            },
            {
                'name': 'Dark Remix',
                'description': 'Transform into a darker, moodier version',
                'params': {'mood': 'dark', 'pitch_shift': -2}
            }
        ]
        
        return jsonify({
            'success': True,
            'features': features,
            'suggested_moods': suggested_moods,
            'suggested_genres': suggested_genres,
            'creative_suggestions': suggestions,
            'duration': len(audio) / 1000.0
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download generated audio file"""
    try:
        filepath = os.path.join(GENERATED_FOLDER, filename)
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stream/<filename>', methods=['GET'])
def stream_file(filename):
    """Stream audio file"""
    try:
        filepath = os.path.join(GENERATED_FOLDER, filename)
        if os.path.exists(filepath):
            return send_file(filepath, mimetype='audio/wav')
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
