'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Navigation from '@/components/Navigation';
import { useMusic } from '@/components/MusicProvider';

export default function CakePage() {
  const [blown, setBlown] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [blowLevel, setBlowLevel] = useState(0);
  const { playSFX } = useMusic();

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
    
    // Use global playSFX for better mixing
    playSFX('https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3', 1.0);
    playSFX('https://cdn.pixabay.com/audio/2022/03/15/audio_731454c0e6.mp3?filename=happy-birthday-155461.mp3', 0.8);

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
        <div className="mb-8 md:mb-12 text-center space-y-2 md:space-y-4">
          <h1 className="text-4xl md:text-6xl font-playfair text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] font-bold italic">
            {blown ? "Happy Birthday! ✨" : "Make a Wish..."}
          </h1>
          <p className="text-white/60 font-serif italic text-base md:text-xl">
            {blown ? "Semoga semua harapanmu terkabul, Kak Arey!" : (micEnabled ? "Tiup lilinnya dari mic perangkatmu!" : "Ketuk lilinnya untuk meniup!")}
          </p>
        </div>

        {/* The Cake - Upgraded Visuals */}
        <div className="relative cursor-pointer scale-[0.7] sm:scale-[0.9] md:scale-110 group perspective-[1000px]" onClick={() => {
          if (!blown) {
            playSFX('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', 0.5);
            handleBlowOut();
          }
        }}>
          <div className="absolute inset-0 bg-red-500/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible relative z-10 filter brightness-110">
            {/* Plate shadow */}
            <ellipse cx="200" cy="440" rx="160" ry="40" fill="black" opacity="0.4" />
            
            {/* Plate */}
            <ellipse cx="200" cy="430" rx="170" ry="45" fill="url(#plateGradient)" />
            <ellipse cx="200" cy="422" rx="150" ry="35" fill="#f0f0f0" />
            
            {/* Cake Base Layer */}
            <path d="M60 410 C60 450, 340 450, 340 410 L340 300 C340 340, 60 340, 60 300 Z" fill="url(#baseLayerGradient)" />
            <ellipse cx="200" cy="300" rx="140" ry="40" fill="#ffb3b3" />
            
            {/* Cake Middle Layer */}
            <path d="M85 300 C85 335, 315 335, 315 300 L315 210 C315 245, 85 245, 85 210 Z" fill="url(#midLayerGradient)" />
            <ellipse cx="200" cy="210" rx="115" ry="35" fill="#ff85a2" />
            
            {/* Cake Top Layer */}
            <path d="M115 210 C115 240, 285 240, 285 210 L285 140 C285 170, 115 170, 115 140 Z" fill="url(#topLayerGradient)" />
            <ellipse cx="200" cy="140" rx="85" ry="25" fill="#ffffff" />

            {/* Icing Drips - Detailed */}
            <path d="M115 140 Q135 185 155 140 Q175 195 200 140 Q225 190 255 140 Q270 170 285 140" fill="white" />
            <path d="M85 210 Q115 255 145 210 Q175 270 210 210 Q245 260 285 210 Q300 240 315 210" fill="#ff85a2" opacity="0.8" />

            {/* Sprinkles */}
            {[...Array(20)].map((_, i) => (
                <circle key={`s1-${i}`} cx={100 + Math.random() * 200} cy={320 + Math.random() * 60} r="3" fill={['#ff4d4d', '#ffeb3b', '#4caf50', '#2196f3', '#e91e63'][i % 5]} opacity="0.7" />
            ))}
            {[...Array(15)].map((_, i) => (
                <circle key={`s2-${i}`} cx={120 + Math.random() * 160} cy={220 + Math.random() * 50} r="2.5" fill={['#ff4d4d', '#ffeb3b', '#4caf50', '#2196f3', '#e91e63'][i % 5]} opacity="0.8" />
            ))}

            {/* Strawberries / Decorations on top */}
            {[
                { x: 160, y: 130 },
                { x: 240, y: 130 },
                { x: 200, y: 115 },
                { x: 140, y: 150 },
                { x: 260, y: 150 }
            ].map((pos, i) => (
                <g key={`deco-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                    <path d="M-10 0 Q 0 -15 10 0 Q 0 15 -10 0" fill="#e91e63" />
                    <circle cx="0" cy="-2" r="1.5" fill="white" opacity="0.5" />
                </g>
            ))}

            {/* Candles - Enhanced */}
            {[
              { x: 150, y: 70, h: 55, color: "url(#candle1)", delay: 0 },
              { x: 175, y: 55, h: 65, color: "url(#candle2)", delay: 0.2 },
              { x: 200, y: 50, h: 70, color: "url(#candle1)", delay: 0.4 },
              { x: 225, y: 60, h: 60, color: "url(#candle2)", delay: 0.1 },
              { x: 250, y: 80, h: 50, color: "url(#candle1)", delay: 0.3 }
            ].map((candle, i) => (
              <g key={i} transform={`translate(${candle.x}, ${candle.y})`}>
                <rect x="-5" y="20" width="12" height={candle.h} rx="3" fill={candle.color} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                <line x1="1" y1="20" x2="1" y2="12" stroke="#333" strokeWidth="1.5" />
                <AnimatePresence>
                  {!blown && (
                    <motion.g
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.25, 1], 
                        rotate: [0, -5, 5, 0] 
                      }}
                      transition={{ repeat: Infinity, duration: 0.4 + candle.delay, ease: "easeInOut" }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="origin-bottom"
                    >
                      {/* Inner Flame */}
                      <path d="M1 12 C 1 12, -4 5, 1 -8 C 6 5, 1 12, 1 12 Z" fill="#ffcc00" className="drop-shadow-[0_0_15px_rgba(255,204,0,0.8)]" />
                      {/* Outer Flame Glow */}
                      <path d="M1 12 C 1 12, -7 2, 1 -12 C 9 2, 1 12, 1 12 Z" fill="#ff6600" opacity="0.4" />
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            ))}

            {/* Gradients */}
            <defs>
              <linearGradient id="plateGradient" x1="200" y1="430" x2="200" y2="475" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e0e0e0" />
                <stop offset="1" stopColor="#999999" />
              </linearGradient>
              <linearGradient id="baseLayerGradient" x1="200" y1="300" x2="200" y2="410" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffb3b3" />
                <stop offset="1" stopColor="#ff8080" />
              </linearGradient>
              <linearGradient id="midLayerGradient" x1="200" y1="210" x2="200" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff85a2" />
                <stop offset="1" stopColor="#ff4d79" />
              </linearGradient>
              <linearGradient id="topLayerGradient" x1="200" y1="140" x2="200" y2="210" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#f0f0f0" />
              </linearGradient>
              <linearGradient id="candle1" x1="0" y1="0" x2="10" y2="0">
                <stop stopColor="#ffccd5" />
                <stop offset="1" stopColor="#ff8095" />
              </linearGradient>
              <linearGradient id="candle2" x1="0" y1="0" x2="10" y2="0">
                <stop stopColor="#ffb3c1" />
                <stop offset="1" stopColor="#ff4d6d" />
              </linearGradient>
            </defs>
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
