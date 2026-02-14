import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AudioPlayer = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (audio && audioRef.current) {
      audioRef.current.src = `${API_URL}/stream/${audio.filename}`;
      audioRef.current.load();
    }
  }, [audio]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/download/${audio.filename}`, '_blank');
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">
            {audio.isRemix ? 'Remixed Audio' : 'Generated Music'}
          </h3>
          <p className="text-white/70 capitalize">
            {audio.mood} • {audio.genre}
            {audio.tempo && ` • ${audio.tempo} BPM`}
          </p>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Progress Bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2 relative overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-white/70 text-sm mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          )}
        </button>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <Download className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Download</span>
        </button>
      </div>

      {/* Waveform Visualization (Decorative) */}
      <div className="mt-6 flex items-center justify-center gap-1 h-16">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full transition-all ${
              isPlaying ? 'animate-pulse-slow' : ''
            }`}
            style={{
              height: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.05}s`,
              opacity: isPlaying ? 0.8 : 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
