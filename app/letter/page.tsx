'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';

const playPageFlip = () => {
    try {
        const audio = new Audio('/sfx/page-flip.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Silakan upload file sfx/page-flip.mp3 terlebih dahulu.'));
    } catch (e) {
        // Ignore
    }
};

const pages = [
  {
    title: "Untuk Kamu,",
    content: "Hai... Aku tahu mungkin ini terlihat sederhana, tapi aku membuatkan ini khusus untukmu. Sebuah tempat kecil di mana kita bisa menyimpan memori, dan aku bisa menyusun kata-kata ini.",
    polaroids: [
      { src: "/1.jpeg", position: "top-[-30px] right-[-20px]", rotation: "rotate-[8deg]" }
    ]
  },
  {
    title: "Halaman Kedua",
    content: "Setiap baris kode di sini ditulis dengan memikirkanmu. Lucu ya, bagaimana teknologi bisa menjadi cara lain untuk mengekspresikan perasaan dan cerita kita.",
    polaroids: [
      { src: "/2.jpeg", position: "bottom-[-20px] left-[-30px]", rotation: "-rotate-[6deg]" }
    ]
  },
  {
    title: "Sebuah Pengingat",
    content: "Meski mungkin kadang kita sibuk atau terpisah jarak, aku harap tempat kecil ini bisa jadi pengingat: betapa kamu berarti buatku.",
    polaroids: [
      { src: "/3.jpeg", position: "top-[20%] right-[-40px]", rotation: "rotate-[12deg]" }
    ]
  },
  {
    title: "Selamanya",
    content: "Semoga hari-harimu selalu dipenuhi kebahagiaan. Dan ingat, kamu selalu memiliki tempat yang sangat spesial di hatiku.\n\nLove ❤️",
    polaroids: [
      { src: "/4.jpeg", position: "top-[-40px] left-[-20px]", rotation: "-rotate-[10deg]" },
      { src: "/5.jpeg", position: "bottom-[-30px] right-[-20px]", rotation: "rotate-[5deg]" }
    ]
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
      
      <div className="relative w-full max-w-2xl perspective-[1500px] z-10 mt-[-40px]">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair text-white/80 tracking-widest uppercase">Love Letter</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: 90, opacity: 0, transformOrigin: 'left' }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-[#fdfbf7] text-[#333] p-12 md:p-20 rounded-r-3xl rounded-l-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[50vh] border-l-8 border-[#8b4513] relative overflow-visible flex flex-col"
          >
            {/* Texture kertas ringan */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-red-900 mb-8 relative z-10">{pages[currentPage].title}</h2>
            <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-800 whitespace-pre-wrap relative z-10 flex-grow">
                {pages[currentPage].content}
            </p>
            
            {/* Scattered Polaroids */}
            {pages[currentPage].polaroids?.map((polaroid, idx) => (
              <motion.div
                key={polaroid.src + currentPage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (idx * 0.2), type: 'spring' }}
                className={`absolute ${polaroid.position} ${polaroid.rotation} w-32 md:w-40 p-3 bg-white shadow-xl border border-gray-200 z-20 pointer-events-none`}
              >
                <img src={polaroid.src} alt="Memory polaroid" className="w-full h-auto aspect-square object-cover" />
              </motion.div>
            ))}

            <div className="absolute bottom-6 right-8 text-lg font-bold text-gray-400 font-mono">
              {currentPage + 1} / {pages.length}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-16 relative z-10">
          <button 
            onClick={prev} 
            disabled={currentPage === 0} 
            className="px-8 py-3 text-lg md:text-xl rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-all font-medium"
          >
            Sebelumnya
          </button>
          <button 
            onClick={next} 
            disabled={currentPage === pages.length - 1} 
            className="px-8 py-3 text-lg md:text-xl rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] font-medium"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </main>
  );
}
