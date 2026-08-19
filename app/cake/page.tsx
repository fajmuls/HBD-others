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
      audio.play().catch(e => console.log('Silakan upload file sfx/blow.mp3'));
    } catch (e) {}

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
        <div className="relative cursor-pointer scale-[0.8] md:scale-100" onClick={handleBlowOut}>
          <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
            {/* Plate */}
            <ellipse cx="150" cy="350" rx="140" ry="30" fill="#2d1a1a" />
            <ellipse cx="150" cy="345" rx="130" ry="25" fill="#3d2b2b" />

            {/* Bottom Layer */}
            <path d="M40 330 C40 360, 260 360, 260 330 L260 250 C260 280, 40 280, 40 250 Z" fill="#ff9999" />
            <ellipse cx="150" cy="250" rx="110" ry="25" fill="#ffb3b3" />
            
            {/* Middle Layer */}
            <path d="M60 250 C60 275, 240 275, 240 250 L240 180 C240 205, 60 205, 60 180 Z" fill="#ff708a" />
            <ellipse cx="150" cy="180" rx="90" ry="20" fill="#ff85a2" />

            {/* Top Layer */}
            <path d="M85 180 C85 200, 215 200, 215 180 L215 120 C215 140, 85 140, 85 120 Z" fill="#fffaf0" />
            <ellipse cx="150" cy="120" rx="65" ry="15" fill="#ffffff" />

            {/* Premium Drips */}
            <path d="M85 120 Q100 150 115 120 Q130 160 150 120 Q170 155 190 120 Q205 140 215 120" fill="#ffffff" />
            <path d="M60 180 Q80 210 100 180 Q120 220 150 180 Q180 215 210 180 Q225 205 240 180" fill="#ff85a2" opacity="0.6" />

            {/* Candles */}
            <g transform="translate(110, 60)">
              <rect x="0" y="20" width="10" height="40" rx="2" fill="#ffccd5" />
              <line x1="5" y1="20" x2="5" y2="15" stroke="#444" strokeWidth="1" />
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    exit={{ scale: 0, opacity: 0 }}
                    d="M5 15 C 5 15, 0 10, 5 0 C 10 10, 5 15, 5 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_8px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>

            <g transform="translate(145, 50)">
              <rect x="0" y="20" width="10" height="45" rx="2" fill="#ffb3c1" />
              <line x1="5" y1="20" x2="5" y2="15" stroke="#444" strokeWidth="1" />
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    exit={{ scale: 0, opacity: 0 }}
                    d="M5 15 C 5 15, 0 10, 5 0 C 10 10, 5 15, 5 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_8px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>

            <g transform="translate(180, 65)">
              <rect x="0" y="20" width="10" height="35" rx="2" fill="#ffccd5" />
              <line x1="5" y1="20" x2="5" y2="15" stroke="#444" strokeWidth="1" />
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    exit={{ scale: 0, opacity: 0 }}
                    d="M5 15 C 5 15, 0 10, 5 0 C 10 10, 5 15, 5 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_8px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>
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
