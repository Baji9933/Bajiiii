/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, LayoutDashboard, Settings } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#e0e0e6] flex flex-col font-mono selection:bg-[#00f3ff] selection:text-black">
      {/* Header */}
      <header className="relative z-10 h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl">
        <div className="text-2xl font-black tracking-[0.2em] text-neon-cyan uppercase">
          NEON SYNTH
        </div>
        
        <div className="flex gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-60 uppercase tracking-widest">Active Units</span>
            <span className="text-lg text-[#ff00ff] text-neon-pink">{String(highScore).padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] opacity-60 uppercase tracking-widest">Session Cache</span>
             <span className="text-lg text-[#00f3ff] text-neon-cyan">000,420</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 p-6 overflow-y-auto">
        {/* Left Side: System Audio */}
        <aside className="glass-panel p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.2em] text-[#00f3ff] mb-6">System Audio</h2>
            <div className="space-y-4">
              <div className="p-3 border-l-2 border-[#00f3ff] bg-white/5 cursor-pointer">
                <p className="text-xs font-bold font-mono">Electric Dreams</p>
                <p className="text-[10px] opacity-50">AI Genesis v1.2</p>
              </div>
              <div className="p-3 border-b border-white/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                <p className="text-xs font-bold font-mono">Crystal Circuit</p>
                <p className="text-[10px] opacity-50">Silicon Soul</p>
              </div>
              <div className="p-3 border-b border-white/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                <p className="text-xs font-bold font-mono">Midnight Grid</p>
                <p className="text-[10px] opacity-50">Cyber-Drone</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <h3 className="text-[11px] font-bold mb-4 opacity-80 uppercase tracking-widest">Controls</h3>
            <div className="text-[10px] opacity-60 flex flex-col gap-2 uppercase tracking-wide">
               <p>[Arrows] Movement</p>
               <p>[Space] Play / Pause</p>
               <p>[N] Next Track</p>
               <p className="mt-4 text-[#ff00ff]">Eat the pink pulses to increase score and audio frequency</p>
            </div>
          </div>
        </aside>

        {/* Center: Logic Stage */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-4"
        >
          <div className="mb-4 flex items-center gap-2 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
             <span className="text-[9px] uppercase tracking-[0.3em]">Arcade Stream Ready</span>
          </div>
          <SnakeGame onScoreChange={handleScoreChange} />
        </motion.div>

        {/* Right Side: Audio Output */}
        <aside className="glass-panel p-6 flex flex-col gap-6">
           <div>
            <h2 className="text-[12px] uppercase tracking-[0.2em] text-[#00f3ff] mb-6">Audio Output</h2>
            <MusicPlayer />
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
               <p className="text-[10px] opacity-40 uppercase mb-2">Memory Load</p>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['40%', '65%', '45%'] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-full bg-[#ff00ff]" 
                  />
               </div>
            </div>
             <div className="p-4 bg-white/5 rounded-lg border border-white/5">
               <p className="text-[10px] opacity-40 uppercase mb-2">Neural Sync</p>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['80%', '95%', '85%'] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-full bg-[#00f3ff]" 
                  />
               </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-between px-10 text-[9px] opacity-30 uppercase tracking-[0.3em]">
        <div className="flex gap-6">
          <span>Node: 0x8a72b</span>
          <span className="text-[#39ff14]">System Healthy</span>
        </div>
        <div className="flex gap-4 text-right">
          <span>Environment: Immersive_v1.0.4</span>
          <span>© Cyber-Synth 1984</span>
        </div>
      </footer>
    </div>
  );
}
