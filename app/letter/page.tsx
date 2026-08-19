'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';

const playPageFlip = () => {
    try {
        const audio = new Audio('/sfx/page-flip.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio error'));
    } catch (e) {
        // Ignore
    }
};

const pages = [
  {
    title: "Untuk Kamu,",
    content: "Hai... Aku tahu mungkin ini terlihat sederhana, tapi aku membuatkan ini khusus untukmu. Sebuah tempat kecil di mana kita bisa menyimpan memori, dan aku bisa menyusun kata-kata ini.",
    image: null
  },
  {
    title: "Halaman Kedua",
    content: "Setiap baris kode di sini ditulis dengan memikirkanmu. Lucu ya, bagaimana teknologi bisa menjadi cara lain untuk mengekspresikan perasaan dan cerita kita.",
    image: null
  },
  {
    title: "Sebuah Pengingat",
    content: "Meski mungkin kadang kita sibuk atau terpisah jarak, aku harap tempat kecil ini bisa jadi pengingat: betapa kamu berarti buatku.",
    image: null
  },
  {
    title: "Selamanya",
    content: "Semoga hari-harimu selalu dipenuhi kebahagiaan. Dan ingat, kamu selalu memiliki tempat yang sangat spesial di hatiku.\n\nLove ❤️",
    image: "/1.jpeg" // Adding photo to the end of the book
  }
];

export default function LetterPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    playPageFlip();
    setCurrentPage(p => Math.min(pages.length - 1, p + 1));
  };
  const prev = () => {
    playPageFlip();
    setCurrentPage(p => Math.max(0, p - 1));
  };

  return (
    <main className="w-screen min-h-screen bg-[#060010] text-white flex items-center justify-center p-6 pb-32 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_60%)] pointer-events-none" />
      <Navigation />
      
      <div className="relative w-full max-w-lg perspective-[1500px] z-10 mt-[-40px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair text-white/80 tracking-widest uppercase">Love Letter</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: 90, opacity: 0, transformOrigin: 'left' }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-[#fdfbf7] text-[#333] p-10 md:p-14 rounded-r-3xl rounded-l-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[50vh] border-l-8 border-[#8b4513] relative overflow-hidden flex flex-col"
          >
            {/* Texture kertas ringan */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
            
            <h2 className="text-3xl font-playfair font-bold text-red-900 mb-6 relative z-10">{pages[currentPage].title}</h2>
            <p className="text-lg font-serif leading-relaxed text-gray-800 whitespace-pre-wrap relative z-10 flex-grow">{pages[currentPage].content}</p>
            
            {pages[currentPage].image && (
              <div className="mt-6 relative z-10 rounded-lg overflow-hidden border-4 border-white shadow-md transform -rotate-2">
                <img src={pages[currentPage].image} alt="Memory" className="w-full h-auto" />
              </div>
            )}

            <div className="absolute bottom-6 right-8 text-sm font-bold text-gray-400 font-mono">
              {currentPage + 1} / {pages.length}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 relative z-10">
          <button 
            onClick={prev} 
            disabled={currentPage === 0} 
            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-all font-medium"
          >
            Sebelumnya
          </button>
          <button 
            onClick={next} 
            disabled={currentPage === pages.length - 1} 
            className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] font-medium"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </main>
  );
}
