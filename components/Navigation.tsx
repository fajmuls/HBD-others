'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, Image as ImageIcon, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useState } from 'react';

const VERSION = "v1.1.0";
const PATCH_NOTES = [
  "Revamped Love Intensity (Love Bar) section",
  "Optimized UI for mobile (smaller icons, font sizes)",
  "Fixed photo rendering and overflow issues",
  "Updated typewriter text to 'Kak Arey'",
  "Fixed favicon rendering",
  "Improved 'My Everything' label visibility",
  "Fixed lightbox scaling in Memories"
];

export default function Navigation() {
  const pathname = usePathname();
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  
  const links = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cake', icon: Gift, label: 'Cake' },
    { path: '/letter', icon: BookHeart, label: 'Story' },
    { path: '/memories', icon: ImageIcon, label: 'Memories' },
  ];

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        {/* Version Indicator */}
        <button 
          onClick={() => setShowPatchNotes(true)}
          className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5"
        >
          {VERSION}
        </button>

        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`relative p-2 md:p-3 rounded-full flex items-center justify-center transition-colors group ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'}`}
                title={link.label}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill" 
                    className="absolute inset-0 bg-red-500/50 rounded-full blur-[2px]" 
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <link.icon size={18} className="md:size-[22px] relative z-10 transition-transform group-hover:scale-110" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Patch Notes Modal */}
      <AnimatePresence>
        {showPatchNotes && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowPatchNotes(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-playfair text-white">Patch Notes {VERSION}</h3>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-400/10 px-2 py-1 rounded">Update</span>
              </div>
              <ul className="space-y-3">
                {PATCH_NOTES.map((note, i) => (
                  <li key={i} className="text-sm text-white/60 flex gap-3">
                    <span className="text-red-500">•</span>
                    {note}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setShowPatchNotes(false)}
                className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
