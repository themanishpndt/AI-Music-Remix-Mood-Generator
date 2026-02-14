import React, { useState, useRef } from 'react';
import { Upload, Loader2, FileAudio, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AudioRemixer = ({ moods, genres, onAudioRemixed, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedGenre, setSelectedGenre] = useState('electronic');
  const [tempoChange, setTempoChange] = useState(1.0);
  const [pitchShift, setPitchShift] = useState(0);
  const [addHarmony, setAddHarmony] = useState(false);
  const [harmonyType, setHarmonyType] = useState('third');
  const [intelligentTransform, setIntelligentTransform] = useState(false);
  const [sourceMood, setSourceMood] = useState('happy');
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an audio file
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid audio file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an audio file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setAudioAnalysis(response.data);
      }
    } catch (err) {
      setError('Failed to analyze audio');
      console.error('Error analyzing audio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemix = async () => {
    if (!selectedFile) {
      setError('Please select an audio file first');
      return;
    }

    setLoading(true);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('mood', selectedMood);
    formData.append('genre', selectedGenre);
    formData.append('tempo_change', tempoChange);
    formData.append('pitch_shift', pitchShift);
    formData.append('add_harmony', addHarmony);
    formData.append('harmony_type', harmonyType);
    formData.append('intelligent_transform', intelligentTransform);
    formData.append('source_mood', sourceMood);

    try {
      const response = await axios.post(`${API_URL}/remix`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onAudioRemixed({
          filename: response.data.filename,
          mood: response.data.mood,
          genre: response.data.genre,
          isRemix: true
        });
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.ffmpeg_required) {
        setError(
          `${errorData.error}\n\nInstall FFmpeg:\n1. Using Chocolatey: choco install ffmpeg\n2. Or download from: ${errorData.install_url}\n\nAlternatively, use WAV files which don't require FFmpeg.`
        );
      } else {
        setError(errorData?.error || 'Failed to remix audio');
      }
      console.error('Error remixing audio:', err);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    energetic: '⚡',
    calm: '😌',
    dark: '🌑',
    uplifting: '🌟'
  };

  const genreIcons = {
    electronic: '🎹',
    ambient: '🌊',
    rock: '🎸',
    classical: '🎻',
    jazz: '🎷'
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Remix Your Audio</h2>
        <p className="text-white/80">Upload audio and transform it with AI-powered effects</p>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Upload Audio File
        </label>
        
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/40 rounded-lg p-12 text-center cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all"
          >
            <Upload className="w-16 h-16 text-white/60 mx-auto mb-4" />
            <p className="text-white/80 text-lg mb-2">Click to upload audio file</p>
            <p className="text-white/60 text-sm">Supports WAV, MP3, and other audio formats</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="bg-white/20 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">{selectedFile.name}</p>
                <p className="text-white/60 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Mood Selection */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Target Mood
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`p-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                selectedMood === mood
                  ? 'bg-white text-purple-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="text-2xl mr-2">{moodEmojis[mood] || '🎵'}</span>
              <span className="capitalize">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Target Genre
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`p-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                selectedGenre === genre
                  ? 'bg-white text-purple-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="text-2xl mr-2">{genreIcons[genre] || '🎵'}</span>
              <span className="capitalize">{genre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Analysis Button */}
      {selectedFile && !audioAnalysis && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔍 Analyze Audio & Get AI Suggestions
        </button>
      )}

      {/* Audio Analysis Results */}
      {audioAnalysis && (
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-lg p-4">
          <h3 className="text-white font-bold text-lg mb-3">🎵 AI Analysis</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/10 rounded p-2">
              <p className="text-white/60 text-xs">Energy</p>
              <p className="text-white font-bold">{(audioAnalysis.features.energy * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-white/10 rounded p-2">
              <p className="text-white/60 text-xs">Brightness</p>
              <p className="text-white font-bold">{(audioAnalysis.features.brightness * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-white/80 text-sm font-semibold mb-2">Suggested Moods:</p>
            <div className="flex flex-wrap gap-2">
              {audioAnalysis.suggested_moods.map(mood => (
                <span key={mood} className="bg-purple-500/30 text-white px-3 py-1 rounded-full text-xs">
                  {mood}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setAudioAnalysis(null)}
            className="text-white/60 hover:text-white text-sm"
          >
            Hide Analysis
          </button>
        </div>
      )}

      {/* Intelligent Transform Toggle */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-white font-semibold text-lg">🤖 AI Mood Transform</span>
            <p className="text-white/70 text-sm">Intelligently transform the mood using AI</p>
          </div>
          <input
            type="checkbox"
            checked={intelligentTransform}
            onChange={(e) => setIntelligentTransform(e.target.checked)}
            className="w-6 h-6 rounded"
          />
        </label>
        {intelligentTransform && (
          <div className="mt-3">
            <label className="block text-white/80 text-sm mb-2">Source Mood (Current)</label>
            <select
              value={sourceMood}
              onChange={(e) => setSourceMood(e.target.value)}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
            >
              {moods.map(mood => (
                <option key={mood} value={mood} className="bg-gray-800">{mood}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tempo Change */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Tempo Change: {tempoChange.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={tempoChange}
          onChange={(e) => setTempoChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white 0%, white ${((tempoChange - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) ${((tempoChange - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <div className="flex justify-between text-white/60 text-sm mt-1">
          <span>0.5x (Slower)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Faster)</span>
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all"
      >
        {showAdvanced ? '▼' : '▶'} Advanced Creative Controls
      </button>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="space-y-6 bg-white/5 rounded-lg p-4 border border-white/20">
          {/* Pitch Shift */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Pitch Shift: {pitchShift > 0 ? '+' : ''}{pitchShift} semitones
            </label>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={pitchShift}
              onChange={(e) => setPitchShift(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-white/60 text-xs mt-1">
              <span>-12 (Lower)</span>
              <span>0 (Original)</span>
              <span>+12 (Higher)</span>
            </div>
          </div>

          {/* Harmony Layer */}
          <div className="bg-white/10 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer mb-3">
              <div>
                <span className="text-white font-semibold">🎼 Add Harmony Layer</span>
                <p className="text-white/70 text-sm">Layer harmonic vocals/instruments</p>
              </div>
              <input
                type="checkbox"
                checked={addHarmony}
                onChange={(e) => setAddHarmony(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </label>
            {addHarmony && (
              <div>
                <label className="block text-white/80 text-sm mb-2">Harmony Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['third', 'fifth', 'octave'].map(type => (
                    <button
                      key={type}
                      onClick={() => setHarmonyType(type)}
                      className={`py-2 px-3 rounded-lg font-medium transition-all ${
                        harmonyType === type
                          ? 'bg-white text-purple-600'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remix Button */}
      <button
        onClick={handleRemix}
        disabled={loading || !selectedFile}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Remixing Audio...
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            Remix Audio
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          <pre className="whitespace-pre-wrap font-sans text-sm">{error}</pre>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileAudio className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
          <div className="text-white/90 text-sm">
            <p className="font-semibold mb-1">Remix Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>🎵 Upload any audio file (WAV, MP3, etc.)</li>
              <li>🤖 AI-powered mood transformation</li>
              <li>🎹 Pitch shifting & harmony layers</li>
              <li>⚡ Tempo control (0.5x - 2.0x)</li>
              <li>🎨 Genre-specific effects & filters</li>
              <li>🔍 Audio analysis with AI suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRemixer;
