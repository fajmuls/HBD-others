'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { useMusic } from '@/components/MusicProvider';

const playPageFlip = () => {
    try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    } catch (e) {
        // Ignore
    }
};

const pages = [
  {
    title: "Awal Cerita Kita",
    content: "jujur ya, kalau ada mesin waktu yang bisa lempar aku balik ke masa-masa SMA dulu, aku pasti bakal ketawa paling keras kalau ada yang bilang kita bakal sampai di titik ini. dulu ngelihat kamu aja bawaannya udah pengen ngomel (sebel maksimallll T____T). kamu itu berisik, jahil, dan bener-bener cowoo yang masuk daftar “orang yang nggak akan pernah aku suka” hahahah asli :p.",
    polaroids: [
      { src: "/1.jpeg", position: "bottom-4 right-[-10px] md:right-[-20px]", rotation: "rotate-[8deg]" }
    ]
  },
  {
    title: "Semesta yang Bercanda",
    content: "tapi entah gimana caranya semesta bercanda, cowo yang selama ini paling bikin sebel sekarang malah jadi orang yang favorite buat aku, yang punya tempat paling hangat dan spesial di hati akuu :3♥️",
    polaroids: [
      { src: "/2.jpeg", position: "bottom-4 left-[-10px] md:left-[-20px]", rotation: "-rotate-[6deg]" }
    ]
  },
  {
    title: "Ketulusan Hatimu",
    content: "perjuangan kamu yang pantang menyerah buat luluhin hati akuu yang super duperr keras, penuh benteng takeshii, dan susah banget deh buat jatuh cinta ini bener-bener bikin aku tersadar betapa beruntungnya aku punya kamuuuuu huhu. makaasi banyak ya, Arey sayang. makaasii udah sabar banget hadapin semua gengsiku, udah tulus dari awal, dan ngebuktiin kalau niat baik kamu itu nyata sampai akhirnya bikin aku ikutan jatuh cinta sejauh ini…. T___T",
    polaroids: [
      { src: "/3.jpeg", position: "bottom-8 right-[-15px] md:right-[-30px]", rotation: "rotate-[12deg]" }
    ]
  },
  {
    title: "Doa di Hari Spesialmu",
    content: "di umur kamu yang baru ini, doaku buat kamu panjang dan kencenggg banget. semoga kamu selalu sehat, bahagia, dan dilindungi di mana pun kamu berada. semoga jalan kuliah kamu makin lancar, jalan menuju karir impian kamu dimudahkan banget, dan semua mimpi besar serta wishlist yang kamu susun diam-diam bisa terwujud satu per satu. semoga segala niat baik dan usaha keras kamu selalu dibalas dengan kebaikan yang melimpah. terus satu lagi, kurangi atau jangan ngerokok lagi yaa, semoga kamu bisa terus berubah jadi lebih baik setiap harinya. dan pastinya, semoga di setiap langkah menuju masa depan nanti, kita bisa terus saling genggam tangan, saling dukung, tumbuh bareng, dan laluin semuanya bareng-bareng terus tanpa ada yang dilepas.\n\nselamat ulang tahun ya, arey sayang <333",
    polaroids: [
      { src: "/4.jpeg", position: "bottom-12 left-[-15px] md:left-[-30px]", rotation: "-rotate-[10deg]" }
    ]
  },
  {
    title: "The Songs for You",
    content: "🎵 Tulus – Teman Hidup\njujurr tiap dengerin lagu ini, aku pasti langsung kepikiran kamu, Arey. semua liriknya aku ngerasa \"kita banget\" dan pas sama apa yang aku harapin buat perjalanan kita ke depan\napalagi pas lirik yang ini:\n\n\"Dia yang s'lalu ada untukku\nDi dekatnya aku lebih tenang\nBersamanya jauh lebih terang\"\n\nbeneran se-relate itu :D…dari yang dulu bikin aku sebel maksimal 🥸🥸, sekarang kamu malah jadi orang yang paling bikin aku tenang dan hari-hariku kerasa jauh lebih seru yEayYyy :3♥️",
    polaroids: [
      { src: "/5.jpeg", position: "bottom-4 right-[-10px] md:right-[-20px]", rotation: "rotate-[5deg]" }
    ]
  },
  {
    title: "Harapan Kita Bersama",
    content: "terussss bagian ini nih yang paling ngena di hati (asekkk):\n\n\"Bila di depan nanti banyak cobaan kisah cinta kita\nJangan cepat menyerah\nKau punya aku, ku punya kamu...\"\n\nini sih harapan aku banget buat kita. nanti di depan pasti bakal ada aja ujian atau capeknya, tapi inget yaa... kita jangan gampang nyerah. kamuu tetep punya aku, dan aku punya kamu buat saling jagain bareng-bareng terus yaaaaa <33 !!",
    polaroids: [
      { src: "/6.jpeg", position: "bottom-10 left-[-10px]", rotation: "-rotate-[8deg]" }
    ]
  }
];

export default function LetterPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const { playSFX } = useMusic();
  const constraintsRef = useRef(null);

  const next = () => {
    playSFX('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 0.5);
    playSFX('https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3', 0.5);
    setCurrentPage(p => Math.min(pages.length - 1, p + 1));
  };
  const prev = () => {
    playSFX('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 0.5);
    playSFX('https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3', 0.5);
    setCurrentPage(p => Math.max(0, p - 1));
  };

  return (
    <main ref={constraintsRef} className="w-screen min-h-screen bg-[#060010] text-white flex items-center justify-center p-6 pb-32 overflow-hidden relative">
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
            className="bg-[#fefaf3] text-[#333] p-6 md:p-12 rounded-r-2xl rounded-l-md shadow-2xl min-h-[400px] md:min-h-[550px] border-l-[6px] border-[#6b4226] relative overflow-visible flex flex-col"
          >
            {/* Texture kertas ringan */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
            
            {/* Lined Paper Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ background: 'repeating-linear-gradient(transparent, transparent 31px, #333 32px)' }} />

            <h2 className="text-xl md:text-3xl font-playfair font-bold text-[#4a2c16] mb-4 relative z-10 border-b border-[#4a2c16]/10 pb-2 italic leading-tight">{pages[currentPage].title}</h2>
            <p className="text-[13px] sm:text-base md:text-lg font-serif leading-relaxed sm:leading-loose text-gray-700 whitespace-pre-wrap relative z-10 flex-grow">
                {pages[currentPage].content}
            </p>
            
            {/* Scattered Polaroids - Draggable */}
            {pages[currentPage].polaroids?.map((polaroid, idx) => (
              <motion.div
                key={polaroid.src + currentPage + idx}
                drag
                dragConstraints={constraintsRef}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: polaroid.rotation.includes('-') ? -5 : 5 }}
                transition={{ delay: 0.4 + (idx * 0.2), type: 'spring' }}
                className={`absolute ${polaroid.position} w-24 md:w-40 bg-white p-1.5 pb-6 md:p-3 md:pb-10 shadow-2xl border border-black/5 z-20 cursor-grab active:cursor-grabbing overflow-visible`}
              >
                <div className="w-full aspect-square bg-white overflow-hidden relative border border-black/5 pointer-events-none">
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
