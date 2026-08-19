'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Navigation from '@/components/Navigation';

export default function CakePage() {
  const [blown, setBlown] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [blowLevel, setBlowLevel] = useState(0);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let animationFrame: number;

    const initMic = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log("Media devices API not supported");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicEnabled(true);
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkBlow = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
          const average = sum / bufferLength;
          setBlowLevel(average);

          if (average > 80 && !blown) {
            handleBlowOut();
          } else if (!blown) {
            animationFrame = requestAnimationFrame(checkBlow);
          }
        };
        checkBlow();
      } catch (err) {
        console.log("Mic access denied or error:", err);
      }
    };
    initMic();

    return () => {
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [blown]);

  const handleBlowOut = () => {
    if (blown) return;
    setBlown(true);
    
    try {
      const audio = new Audio('/sfx/blow.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {
        const fallback = new Audio('https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3');
        fallback.volume = 0.3;
        fallback.play().catch(() => {});
      });

      // Play Happy Birthday music (short)
      const hbd = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_731454c0e6.mp3?filename=happy-birthday-155461.mp3');
      hbd.volume = 0.5;
      hbd.play().catch(() => {});
    } catch { }

    // Confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ffb7b2', '#ff9ce3', '#fdfbf7', '#ef4444']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffb7b2', '#ff9ce3', '#fdfbf7', '#ef4444']
      });
    }, 250);
  };

  return (
    <main className="w-screen min-h-screen bg-[#060010] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)] pointer-events-none" />
      <Navigation />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl"
      >
        <div className="mb-8 md:mb-16 text-center space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-playfair text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {blown ? "Happy Birthday! ✨" : "Make a Wish..."}
          </h1>
          <p className="text-white/60 font-serif italic text-base md:text-xl">
            {blown ? "Semoga semua harapanmu terkabul." : (micEnabled ? "Tiup lilinnya dari mic perangkatmu!" : "Ketuk lilinnya untuk meniup!")}
          </p>
        </div>

        {/* The Cake - Responsive Scale */}
        <div className="relative cursor-pointer scale-[0.8] md:scale-110 group" onClick={() => {
          if (!blown) {
            try {
              new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(() => {});
            } catch(e) {}
            handleBlowOut();
          }
        }}>
          <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <svg width="320" height="420" viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible relative z-10">
            {/* Plate */}
            <ellipse cx="160" cy="360" rx="150" ry="35" fill="#2d1a1a" />
            <ellipse cx="160" cy="355" rx="140" ry="30" fill="#3d2b2b" />

            {/* Bottom Layer */}
            <path d="M40 340 C40 375, 280 375, 280 340 L280 260 C280 295, 40 295, 40 260 Z" fill="#ff9999" />
            <ellipse cx="160" cy="260" rx="120" ry="30" fill="#ffb3b3" />
            
            {/* Middle Layer */}
            <path d="M60 260 C60 290, 260 290, 260 260 L260 190 C260 220, 60 220, 60 190 Z" fill="#ff708a" />
            <ellipse cx="160" cy="190" rx="100" ry="25" fill="#ff85a2" />

            {/* Top Layer */}
            <path d="M85 190 C85 215, 235 215, 235 190 L235 130 C235 155, 85 155, 85 130 Z" fill="#fffaf0" />
            <ellipse cx="160" cy="130" rx="75" ry="20" fill="#ffffff" />

            {/* Premium Drips */}
            <path d="M85 130 Q105 165 125 130 Q145 175 165 130 Q185 170 215 130 Q225 150 235 130" fill="#ffffff" />
            <path d="M60 190 Q85 225 110 190 Q135 235 165 190 Q195 230 230 190 Q245 215 260 190" fill="#ff85a2" opacity="0.6" />

            {/* Candles - Increased count and variety */}
            {[
              { x: 120, y: 70, h: 45, color: "#ffccd5", delay: 0 },
              { x: 140, y: 55, h: 55, color: "#ffb3c1", delay: 0.2 },
              { x: 165, y: 50, h: 60, color: "#ffccd5", delay: 0.4 },
              { x: 190, y: 60, h: 50, color: "#ffb3c1", delay: 0.1 },
              { x: 210, y: 80, h: 40, color: "#ffccd5", delay: 0.3 }
            ].map((candle, i) => (
              <g key={i} transform={`translate(${candle.x}, ${candle.y})`}>
                <rect x="0" y="20" width="10" height={candle.h} rx="2" fill={candle.color} />
                <line x1="5" y1="20" x2="5" y2="15" stroke="#444" strokeWidth="1" />
                <AnimatePresence>
                  {!blown && (
                    <motion.path
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.2 + Math.random() * 0.2, 1], 
                        rotate: [0, -5 + Math.random() * 10, 5 - Math.random() * 10, 0] 
                      }}
                      transition={{ repeat: Infinity, duration: 0.4 + candle.delay }}
                      exit={{ scale: 0, opacity: 0 }}
                      d="M5 15 C 5 15, 0 10, 5 0 C 10 10, 5 15, 5 15 Z"
                      fill="#ffaa00"
                      className="drop-shadow-[0_0_12px_rgba(255,170,0,0.9)]"
                    />
                  )}
                </AnimatePresence>
              </g>
            ))}
          </svg>
        </div>

        <AnimatePresence>
          {blown && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 md:mt-12 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 text-center max-w-sm md:max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl md:text-2xl font-playfair text-white mb-3 md:mb-4 italic">A Secret Message</h3>
              <p className="text-sm md:text-base text-white/80 font-serif leading-relaxed italic">
                "Selamat bertambah usia, manusia favoritku. Terima kasih telah lahir ke dunia dan menjadi bagian terindah dalam ceritaku. Semoga setiap langkahmu selalu diiringi tawa dan kebahagiaan."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </main>
  );
}
