import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'Synthwave Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400'
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Electro Pop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '3',
    title: 'Grid Runner',
    artist: 'Tech House',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="flex flex-col w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-xl">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={handleNext}
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isPlaying ? 'animate-[pulse_4s_infinite]' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
          
          {/* Visualizer bars overlay (decorative) */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1.5 p-4 pointer-events-none h-24">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
              <div 
                key={i}
                className="w-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"
                style={{ 
                  height: isPlaying ? `${h * 100}%` : '4px',
                  transition: 'height 0.2s ease', 
                  animation: isPlaying ? `bounce ${0.5 + i * 0.1}s infinite alternate` : 'none'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-zinc-100 truncate">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-1 rounded-full mb-6 relative overflow-hidden">
        <div 
          className="absolute h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={handleBack}
          className="p-2 text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)]"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.2); }
        }
      `}} />
    </div>
  );
};
