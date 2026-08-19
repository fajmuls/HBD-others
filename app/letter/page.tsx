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
    content: "Hai... Aku tahu mungkin ini terlihat sederhana, tapi aku membuatkan ini khusus untukmu. Sebuah tempat kecil di mana kita bisa menyimpan memori.",
    polaroids: [
      { src: "/1.jpeg", position: "bottom-4 right-[-10px] md:right-[-20px]", rotation: "rotate-[8deg]" }
    ]
  },
  {
    title: "Cerita Kita",
    content: "Setiap baris kode di sini ditulis dengan memikirkanmu. Lucu ya, bagaimana teknologi bisa menjadi cara lain untuk mengekspresikan perasaan.",
    polaroids: [
      { src: "/2.jpeg", position: "bottom-4 left-[-10px] md:left-[-20px]", rotation: "-rotate-[6deg]" }
    ]
  },
  {
    title: "Pengingat",
    content: "Meski mungkin kadang kita sibuk, aku harap tempat kecil ini bisa jadi pengingat: betapa kamu berarti buatku.",
    polaroids: [
      { src: "/3.jpeg", position: "bottom-8 right-[-15px] md:right-[-30px]", rotation: "rotate-[12deg]" }
    ]
  },
  {
    title: "Selamanya",
    content: "Semoga hari-harimu selalu dipenuhi kebahagiaan. Kamu selalu memiliki tempat spesial di hatiku.\n\nLove ❤️",
    polaroids: [
      { src: "/4.jpeg", position: "bottom-12 left-[-15px] md:left-[-30px]", rotation: "-rotate-[10deg]" },
      { src: "/5.jpeg", position: "bottom-4 right-[-10px] md:right-[-20px]", rotation: "rotate-[5deg]" }
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
      
      <div className="relative w-full max-w-xl perspective-[1500px] z-10 mt-[-20px] md:mt-[-40px]">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-playfair text-white/60 tracking-[0.2em] uppercase">The Notebook</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: 90, opacity: 0, transformOrigin: 'left' }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-[#fefaf3] text-[#333] p-8 md:p-16 rounded-r-2xl rounded-l-md shadow-2xl min-h-[450px] md:min-h-[550px] border-l-[6px] border-[#6b4226] relative overflow-visible flex flex-col"
          >
            {/* Texture kertas ringan */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
            
            {/* Lined Paper Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ background: 'repeating-linear-gradient(transparent, transparent 31px, #333 32px)' }} />

            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-[#4a2c16] mb-6 relative z-10 border-b border-[#4a2c16]/10 pb-2 italic">{pages[currentPage].title}</h2>
            <p className="text-lg md:text-xl font-serif leading-loose text-gray-700 whitespace-pre-wrap relative z-10 flex-grow">
                {pages[currentPage].content}
            </p>
            
            {/* Scattered Polaroids - Improved Scaling */}
            {pages[currentPage].polaroids?.map((polaroid, idx) => (
              <motion.div
                key={polaroid.src + currentPage}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: polaroid.rotation.includes('-') ? -5 : 5 }}
                transition={{ delay: 0.4 + (idx * 0.2), type: 'spring' }}
                className={`absolute ${polaroid.position} w-32 md:w-48 bg-white p-2 pb-8 md:p-3 md:pb-12 shadow-2xl border border-black/5 z-20 pointer-events-none`}
              >
                <div className="w-full aspect-square bg-white overflow-hidden relative border border-black/5">
                  <img src={polaroid.src} alt="Memory" className="absolute inset-0 w-full h-full object-cover transition-all" />
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-4 right-6 text-sm font-bold text-gray-300 font-mono tracking-widest">
              PG. {currentPage + 1}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10 md:mt-16 relative z-10 px-4">
          <button 
            onClick={prev} 
            disabled={currentPage === 0} 
            className="px-6 py-2 text-sm md:text-base rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all font-medium backdrop-blur-sm"
          >
            Back
          </button>
          <button 
            onClick={next} 
            disabled={currentPage === pages.length - 1} 
            className="px-6 py-2 text-sm md:text-base rounded-full bg-red-900/40 border border-red-500/30 hover:bg-red-800/60 disabled:opacity-20 transition-all shadow-lg font-medium backdrop-blur-sm"
          >
            Next Page
          </button>
        </div>
      </div>
    </main>
  );
}
