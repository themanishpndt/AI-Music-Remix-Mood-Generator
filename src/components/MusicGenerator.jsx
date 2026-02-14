import React, { useState } from 'react';
import { Sparkles, Loader2, Music2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const MusicGenerator = ({ moods, genres, onAudioGenerated, setIsLoading }) => {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedGenre, setSelectedGenre] = useState('electronic');
  const [duration, setDuration] = useState(10);
  const [tempo, setTempo] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        mood: selectedMood,
        genre: selectedGenre,
        duration: duration,
        tempo: tempo
      });

      if (response.data.success) {
        onAudioGenerated({
          filename: response.data.filename,
          mood: response.data.mood,
          genre: response.data.genre,
          tempo: response.data.tempo,
          duration: response.data.duration
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate music');
      console.error('Error generating music:', err);
    } finally {
      setLoading(false);
      setIsLoading(false);
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
        <h2 className="text-3xl font-bold text-white mb-2">Generate Your Music</h2>
        <p className="text-white/80">Select a mood and genre to create unique AI-generated music</p>
      </div>

      {/* Mood Selection */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Select Mood
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
          Select Genre
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

      {/* Duration Control */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Duration: {duration} seconds
        </label>
        <input
          type="range"
          min="5"
          max="30"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, white 0%, white ${((duration - 5) / 25) * 100}%, rgba(255,255,255,0.2) ${((duration - 5) / 25) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <div className="flex justify-between text-white/60 text-sm mt-1">
          <span>5s</span>
          <span>30s</span>
        </div>
      </div>

      {/* Tempo Control */}
      <div>
        <label className="block text-white font-semibold mb-3 text-lg">
          Tempo: {tempo} BPM
        </label>
        <input
          type="range"
          min="60"
          max="180"
          value={tempo}
          onChange={(e) => setTempo(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white 0%, white ${((tempo - 60) / 120) * 100}%, rgba(255,255,255,0.2) ${((tempo - 60) / 120) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <div className="flex justify-between text-white/60 text-sm mt-1">
          <span>60 BPM (Slow)</span>
          <span>180 BPM (Fast)</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generating Music...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Generate Music
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Music2 className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
          <div className="text-white/90 text-sm">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Choose a mood to set the emotional tone</li>
              <li>Select a genre for the musical style</li>
              <li>Adjust duration and tempo to your preference</li>
              <li>Click generate and let AI create your unique track!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicGenerator;
