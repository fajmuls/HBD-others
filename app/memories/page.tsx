'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';

const images = Array.from({ length: 15 }, (_, i) => `/${i + 1}.jpeg`);

export default function MemoriesPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#060010] text-white p-6 pb-32">
      <Navigation />
      
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16 mt-12 relative z-10">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-red-400 drop-shadow-lg">Memories</h1>
          <p className="text-white/60 mt-4 font-serif italic text-lg max-w-xl mx-auto">
            "Sebuah galeri kecil untuk momen-momen indah. Klik gambar untuk melihatnya lebih jelas."
          </p>
        </header>
        
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((src, idx) => (
            <motion.div 
              key={src} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border border-white/10"
              onClick={() => setSelectedImage(src)}
            >
              <img 
                src={src} 
                alt={`Memory ${idx+1}`} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-playfair tracking-wider border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">View</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Enlarged View */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage} 
              alt="Enlarged memory"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain border border-white/20"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-red-500/50 transition-colors p-3 rounded-full backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
