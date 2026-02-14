import React, { useState, useEffect } from 'react';
import { Music, Sparkles, Upload, Download, Play, Pause, Loader2, Volume2, Settings } from 'lucide-react';
import MusicGenerator from './components/MusicGenerator';
import AudioRemixer from './components/AudioRemixer';
import AudioPlayer from './components/AudioPlayer';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [moods, setMoods] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMoodsAndGenres();
  }, []);

  const fetchMoodsAndGenres = async () => {
    try {
      const [moodsRes, genresRes] = await Promise.all([
        axios.get(`${API_URL}/moods`),
        axios.get(`${API_URL}/genres`)
      ]);
      setMoods(moodsRes.data.moods);
      setGenres(genresRes.data.genres);
    } catch (error) {
      console.error('Error fetching moods and genres:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold text-white">
              AI Music Studio
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-xl text-white/90">
            Create amazing music with AI - No technical skills required!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Generate Music
          </button>
          <button
            onClick={() => setActiveTab('remix')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'remix'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Upload className="w-5 h-5" />
            Remix Audio
          </button>
        </div>

        {/* Main Content */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {activeTab === 'generate' ? (
            <MusicGenerator
              moods={moods}
              genres={genres}
              onAudioGenerated={setCurrentAudio}
              setIsLoading={setIsLoading}
            />
          ) : (
            <AudioRemixer
              moods={moods}
              genres={genres}
              onAudioRemixed={setCurrentAudio}
              setIsLoading={setIsLoading}
            />
          )}
        </div>

        {/* Audio Player */}
        {currentAudio && (
          <div className="mt-8">
            <AudioPlayer audio={currentAudio} />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mood-Based Generation</h3>
            <p className="text-white/80">
              Create music that matches your emotions - happy, sad, energetic, calm, and more
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Genre Flexibility</h3>
            <p className="text-white/80">
              Explore different genres like electronic, ambient, rock, classical, and jazz
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Easy Remixing</h3>
            <p className="text-white/80">
              Upload your own audio and transform it with AI-powered effects and mood changes
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/70">
          <p>Built with AI • No musical expertise required</p>
        </div>
      </div>
    </div>
  );
}

export default App;
