import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Gamepad2, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-4 h-full">
        
        {/* Brand & Status (Top Left) */}
        <div className="col-span-12 md:col-span-3 bg-zinc-900/50 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <h1 className="text-xl font-black tracking-tighter text-emerald-400 uppercase">Synth-Snake</h1>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">v2.0.4 // System Online</p>
        </div>

        {/* Global Nav/Stats (Top Right) */}
        <div className="col-span-12 md:col-span-9 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex gap-8">
            <div className="hidden sm:block">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">System Load</p>
              <div className="flex gap-1">
                <div className="w-1.5 h-4 bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                <div className="w-1.5 h-4 bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                <div className="w-1.5 h-4 bg-zinc-700"></div>
                <div className="w-1.5 h-4 bg-zinc-700"></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Process</p>
              <p className="text-sm font-mono text-emerald-400">ACTIVE_STREAM</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Latency</p>
              <p className="text-sm font-mono text-cyan-400">14ms</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer">
              <Terminal size={18} />
            </div>
          </div>
        </div>

        {/* Main Content Area (Combined Sidebar and Center) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className="flex-grow bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Session Log</h2>
            <div className="font-mono text-[10px] text-zinc-500 space-y-3 leading-relaxed">
              <p><span className="text-emerald-500/50">[08:34:33]</span> INITIALIZING_GRID_RENDER...</p>
              <p><span className="text-emerald-500/50">[08:34:35]</span> SYNC_NEON_BUFFERS_OK</p>
              <p className="animate-pulse text-zinc-400">_WAITING_FOR_USER_INPUT</p>
            </div>
          </div>
          
          <div className="bg-emerald-500 border border-emerald-400 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-emerald-950 font-black uppercase tracking-widest">Arcade Ranking</p>
              <p className="text-4xl font-mono font-black text-emerald-950 leading-none mt-1">#42</p>
            </div>
            <div className="flex justify-between items-end border-t border-emerald-600/30 pt-3 mt-4">
              <p className="text-[10px] text-emerald-950 font-bold uppercase">GLOBAL STATS</p>
              <Gamepad2 size={20} className="text-emerald-950/40" />
            </div>
          </div>
        </div>

        {/* Game Arena (Center Piece) */}
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="bg-zinc-950 border border-emerald-500/20 rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
            <SnakeGame />
          </div>
        </div>

        {/* Controls & Mini Info (Right Side) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className="flex-grow">
            <MusicPlayer />
          </div>
        </div>

      </div>
    </div>
  );
}

