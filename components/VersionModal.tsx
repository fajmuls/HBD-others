'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

export const CURRENT_VERSION = "v1.2.0";

const PATCH_NOTES = [
  { version: "v1.2.0", notes: ["Global Music Player (Persistent)", "Typing Sound Effects", "Draggable Polaroids in Notebook", "Upgraded 3D Cake Visuals", "Independent Audio Logic (No Ducking)"] },
  { version: "v1.1.0", notes: ["Initial Interactive Flow", "Dome Gallery Integration", "Letter Layout", "Basic Sound Effects"] },
];

export default function VersionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-white">App Version</h2>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {PATCH_NOTES.map((patch) => (
                <div key={patch.version} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                      {patch.version}
                    </span>
                    <div className="h-px flex-grow bg-white/5" />
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {patch.notes.map((note, i) => (
                      <li key={i} className="text-sm text-white/50 flex gap-2">
                        <span className="text-red-500">•</span> {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Designed with love for Kak Arey</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
