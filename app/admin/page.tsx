'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Shield, Info, History } from 'lucide-react';

const VERSION = "v1.2.0";
const PATCH_NOTES = [
  { version: "v1.2.0", date: "2024-03-20", notes: ["Added 17 memory photos", "Improved cake UI with 5 candles and HBD music", "Updated Love Letter with 4 pages of content", "Added varied sound effects (click, open, flip)", "Updated typewriter text to 'Kak Arey Kuu!!!!'", "Implemented auto-hiding navigation when viewing photos"] },
  { version: "v1.1.0", date: "2024-03-19", notes: ["Mobile UI optimization", "Fixed photo overflow", "Added love intensity bar", "Fixed favicon rendering"] },
  { version: "v1.0.0", date: "2024-03-18", notes: ["Initial release", "Cake blowing interaction", "Story notebook", "3D Memories gallery"] }
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#060010] text-white p-6 pb-32">
      <Navigation />
      
      <div className="max-w-2xl mx-auto pt-12 md:pt-20">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <Shield className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold italic">Dashboard Version</h1>
          <p className="text-white/40 mt-2">Manage and view application updates</p>
        </header>

        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Info size={80} />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80">Active Version</span>
                </div>
                <h2 className="text-6xl font-black tracking-tighter mb-4 text-white">{VERSION}</h2>
                <div className="flex gap-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest">Stable</span>
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">Production</span>
                </div>
            </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <History size={18} className="text-white/40" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Patch History</h3>
          </div>
          
          {PATCH_NOTES.map((patch, i) => (
            <motion.div 
              key={patch.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors group"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold font-mono text-red-400">{patch.version}</h4>
                <span className="text-xs text-white/30">{patch.date}</span>
              </div>
              <ul className="space-y-2">
                {patch.notes.map((note, j) => (
                  <li key={j} className="text-sm text-white/60 flex gap-3">
                    <span className="text-red-500 opacity-50 group-hover:opacity-100 transition-opacity">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}
