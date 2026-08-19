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
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-playfair text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {blown ? "Happy Birthday! ✨" : "Make a Wish..."}
          </h1>
          <p className="text-white/60 font-serif italic text-lg md:text-xl">
            {blown ? "Semoga semua harapanmu terkabul." : (micEnabled ? "Tiup lilinnya dari mic perangkatmu!" : "Ketuk lilinnya untuk meniup!")}
          </p>
        </div>

        {/* The Cake */}
        <div className="relative cursor-pointer" onClick={handleBlowOut}>
          <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
            {/* Plate */}
            <ellipse cx="150" cy="350" rx="140" ry="30" fill="#2d2222" />
            <ellipse cx="150" cy="345" rx="130" ry="25" fill="#4a3b32" />

            {/* Bottom Layer */}
            <path d="M40 330 C40 360, 260 360, 260 330 L260 250 C260 280, 40 280, 40 250 Z" fill="#ffb7b2" />
            <ellipse cx="150" cy="250" rx="110" ry="25" fill="#ff9ce3" />
            
            {/* Middle Layer */}
            <path d="M60 250 C60 275, 240 275, 240 250 L240 180 C240 205, 60 205, 60 180 Z" fill="#ff8ba0" />
            <ellipse cx="150" cy="180" rx="90" ry="20" fill="#ff6b8b" />

            {/* Top Layer */}
            <path d="M85 180 C85 200, 215 200, 215 180 L215 120 C215 140, 85 140, 85 120 Z" fill="#fdfbf7" />
            <ellipse cx="150" cy="120" rx="65" ry="15" fill="#fff5f5" />

            {/* Icing Drips Bottom */}
            <path d="M40 250 Q50 280 60 250 Q75 290 90 250 Q110 275 130 250 Q150 285 170 250 Q190 270 210 250 Q230 290 245 250 Q255 270 260 250" fill="#fdfbf7" />
            
            {/* Icing Drips Middle */}
            <path d="M60 180 Q75 210 90 180 Q110 220 130 180 Q150 205 170 180 Q190 215 210 180 Q225 200 240 180" fill="#fdfbf7" />

            {/* Candles */}
            <g transform="translate(110, 60)">
              {/* Candle Body 1 */}
              <rect x="0" y="20" width="12" height="40" rx="3" fill="#ffb7b2" />
              <path d="M0 30 L12 25 M0 40 L12 35 M0 50 L12 45" stroke="#fff" strokeWidth="2" />
              {/* Wick */}
              <line x1="6" y1="20" x2="6" y2="15" stroke="#444" strokeWidth="2" />
              {/* Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -5, 5, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    d="M6 15 C 6 15, 0 10, 6 0 C 12 10, 6 15, 6 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_10px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>

            <g transform="translate(144, 50)">
              {/* Candle Body 2 */}
              <rect x="0" y="20" width="12" height="45" rx="3" fill="#ff9ce3" />
              <path d="M0 30 L12 25 M0 40 L12 35 M0 50 L12 45 M0 60 L12 55" stroke="#fff" strokeWidth="2" />
              {/* Wick */}
              <line x1="6" y1="20" x2="6" y2="15" stroke="#444" strokeWidth="2" />
              {/* Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 0.8, 1.2, 1], rotate: [0, 3, -4, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    d="M6 15 C 6 15, 0 10, 6 0 C 12 10, 6 15, 6 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_10px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>

            <g transform="translate(178, 65)">
              {/* Candle Body 3 */}
              <rect x="0" y="20" width="12" height="35" rx="3" fill="#ffb7b2" />
              <path d="M0 30 L12 25 M0 40 L12 35" stroke="#fff" strokeWidth="2" />
              {/* Wick */}
              <line x1="6" y1="20" x2="6" y2="15" stroke="#444" strokeWidth="2" />
              {/* Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.path
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 0.9, 1.3, 1], rotate: [0, -3, 4, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.6 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    d="M6 15 C 6 15, 0 10, 6 0 C 12 10, 6 15, 6 15 Z"
                    fill="#ffaa00"
                    className="drop-shadow-[0_0_10px_rgba(255,170,0,0.8)]"
                  />
                )}
              </AnimatePresence>
            </g>

            {/* Smoke when blown */}
            <AnimatePresence>
              {blown && (
                <motion.g
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.5, 0], y: -50, scale: 1.5 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <circle cx="116" cy="65" r="5" fill="#fff" opacity="0.6" filter="blur(2px)" />
                  <circle cx="150" cy="55" r="6" fill="#fff" opacity="0.6" filter="blur(3px)" />
                  <circle cx="184" cy="70" r="4" fill="#fff" opacity="0.6" filter="blur(2px)" />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        <AnimatePresence>
          {blown && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center max-w-md w-full shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
            >
              <h3 className="text-2xl font-playfair text-white mb-4">A Secret Message</h3>
              <p className="text-white/80 font-serif leading-relaxed italic">
                "Selamat bertambah usia, manusia favoritku. Terima kasih telah lahir ke dunia dan menjadi bagian terindah dalam ceritaku. Semoga setiap langkahmu selalu diiringi tawa dan kebahagiaan."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </main>
  );
}
