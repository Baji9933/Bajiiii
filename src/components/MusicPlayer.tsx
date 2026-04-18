import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'AI Synth Orchestra',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/synth/400/400',
    duration: 372
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'CyberBeat Gen',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    duration: 425
  },
  {
    id: '3',
    title: 'Digital Sunset',
    artist: 'LoFi Dreamer AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/lofi/400/400',
    duration: 310
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Visualizer */}
      <div className="flex items-end gap-[3px] h-10 px-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] : '10%' 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
            className="flex-1 bg-gradient-to-t from-[#00f3ff] to-[#ff00ff] min-h-[4px]"
          />
        ))}
      </div>

      <div className="player-controls flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="w-full">
           <div 
            className="h-1 w-full bg-[#333] rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] opacity-40">
             <span>
               {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
               {String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}
             </span>
             <span>
               {Math.floor(currentTrack.duration / 60)}:
               {String(currentTrack.duration % 60).padStart(2, '0')}
             </span>
          </div>
        </div>

        {/* Info */}
        <div className="text-left font-mono">
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{currentTrack.title}</h3>
          <p className="text-[#00f3ff] text-[10px] opacity-60 uppercase">{currentTrack.artist}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-around">
          <button 
            onClick={prevTrack}
            className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] hover:shadow-[0_0_10px_#00f3ff] transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center border border-[#ff00ff] text-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <button 
            onClick={nextTrack}
            className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] hover:shadow-[0_0_10px_#00f3ff] transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
