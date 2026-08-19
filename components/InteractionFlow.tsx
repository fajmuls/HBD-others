'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle, Flame, Sparkles } from 'lucide-react';

const playAudio = (path: string) => {
    try {
        const audio = new Audio(`/sfx/${path}`);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play blocked by browser until user interaction.'));
    } catch (e) {
        // Safe to ignore if file not found
    }
};

// --- Background Particles ---
const BackgroundHearts = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: '110vh', x: `${(i * 10) + Math.random() * 5}%`, scale: 0.5 }}
                    animate={{ opacity: [0, 0.2, 0], y: '-10vh', rotate: [0, 180], scale: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: i * 2, ease: "linear" }}
                    className="absolute text-red-500/10"
                >
                    <Heart size={30} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// --- Step 1: Love Mode ---
const LoveModeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        if (isOn) {
            playAudio('love-mode.mp3');
            const timer = setTimeout(() => onComplete(), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOn, onComplete]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }} className="flex flex-col items-center justify-center relative z-10">
            <div className={`backdrop-blur-2xl p-12 rounded-[3rem] transition-all duration-1000 ease-in-out flex flex-col items-center space-y-10 border border-white/10 ${isOn ? 'bg-red-500/10 shadow-[0_0_80px_rgba(239,68,68,0.2)] border-red-500/20' : 'bg-white/5 shadow-2xl'}`}>
                <div className="relative">
                    <motion.div animate={isOn ? { scale: [1, 1.15, 1], filter: ['drop-shadow(0 0 0px rgba(239,68,68,0))', 'drop-shadow(0 0 20px rgba(239,68,68,0.6))', 'drop-shadow(0 0 0px rgba(239,68,68,0))'] } : {}} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                        <Heart className={`w-24 h-24 transition-all duration-1000 ${isOn ? 'text-red-500 fill-red-500' : 'text-white/10'}`} />
                    </motion.div>
                </div>
                <div className="flex flex-col items-center space-y-6">
                    <span className={`text-5xl font-playfair transition-colors duration-1000 ${isOn ? 'text-white' : 'text-white/40'}`}>Love mode</span>
                    <button onClick={() => setIsOn(!isOn)} className={`group relative w-32 h-16 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-1.5 focus:outline-none ${isOn ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}>
                        <motion.div animate={{ x: isOn ? 64 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="w-13 h-13 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-none" style={{ width: '52px', height: '52px' }}>
                            <Heart size={24} className={`transition-colors duration-500 ${isOn ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                        </motion.div>
                        <AnimatePresence>
                            {!isOn && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">off</motion.span>}
                            {isOn && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">on</motion.span>}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Step 2: Tic-Tac-Toe ---
const TicTacToeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isUserTurn, setIsUserTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [message, setMessage] = useState("Let's play a little game...");

    const checkWinner = useCallback((squares: (string | null)[]) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
        }
        return squares.includes(null) ? null : 'draw';
    }, []);

    const makeAIMove = useCallback((currentBoard: (string | null)[]) => {
        const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length === 0) return;
        const nonCenterIndices = emptyIndices.filter(i => i !== 4);
        const targetIndex = nonCenterIndices.length > 0 ? nonCenterIndices[Math.floor(Math.random() * nonCenterIndices.length)] : 4;
        const newBoard = [...currentBoard];
        newBoard[targetIndex] = 'O';
        setBoard(newBoard);
        const result = checkWinner(newBoard);
        if (result) setWinner(result); else setIsUserTurn(true);
    }, [checkWinner]);

    const handleSquareClick = (index: number) => {
        if (board[index] || winner || !isUserTurn) return;
        playAudio('tictactoe-click.mp3');
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        const result = checkWinner(newBoard);
        if (result) setWinner(result); else {
            setIsUserTurn(false);
            setTimeout(() => makeAIMove(newBoard), 600);
        }
    };

    useEffect(() => {
        if (winner === 'X') {
            setMessage("Kamu Memenangkan");
            playAudio('tictactoe-win.mp3');
            setTimeout(() => onComplete(), 3500);
        } else if (winner === 'O' || winner === 'draw') {
            setMessage(winner === 'draw' ? "Seri! Coba lagi yaa ❤️" : "Hampir! Sekali lagi...");
            setTimeout(() => { setBoard(Array(9).fill(null)); setWinner(null); setIsUserTurn(true); }, 1500);
        }
    }, [winner, onComplete]);

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center space-y-10 relative z-10">
            <h2 className="text-4xl font-playfair text-white text-center drop-shadow-lg max-w-xs whitespace-pre-line leading-tight">{winner === 'X' ? "Kamu Memenangkan" : message}</h2>
            <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                {board.map((square, i) => (
                    <button key={i} onClick={() => handleSquareClick(i)} className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all duration-300 group">
                        <AnimatePresence mode="wait">
                            {square === 'X' ? (
                                <motion.div key={winner === 'X' ? "heart" : "x"} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={winner === 'X' ? { delay: i * 0.15, type: 'spring' } : {}}>
                                    {winner === 'X' ? <Heart className="w-12 h-12 text-red-500 fill-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> : <X className="w-12 h-12 text-white/80" />}
                                </motion.div>
                            ) : square === 'O' ? (
                                <motion.div key="o" initial={{ scale: 0 }} animate={{ scale: 1 }}><Circle className="w-12 h-12 text-pink-300 opacity-50" /></motion.div>
                            ) : null}
                        </AnimatePresence>
                    </button>
                ))}
            </div>
            <AnimatePresence>
                {winner === 'X' && <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-playfair text-white text-center drop-shadow-lg mt-4">Hatiku</motion.h2>}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Step 3: Love Meter ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { clearInterval(interval); setTimeout(() => onComplete(), 1500); return 100; }
                return prev + 1;
            });
        }, 40);
        return () => clearInterval(interval);
    }, [onComplete]);

    const radius = 90;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center space-y-12 w-full max-w-lg px-6 relative z-10">
            <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full h-full absolute top-0 overflow-visible">
                    <path d="M 10,100 A 90,90 0 0 1 190,100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                    <motion.path d="M 10,100 A 90,90 0 0 1 190,100" fill="none" stroke="url(#loveGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: dashOffset }} transition={{ duration: 0.1, ease: "linear" }} style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }} />
                    <defs><linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                </svg>
                <div className="z-10 flex flex-col items-center pb-4">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart className="w-16 h-16 text-red-500 fill-red-500 mb-2" /></motion.div>
                    <div className="text-6xl font-black text-white font-mono tracking-tighter">{progress}<span className="text-red-400 text-3xl">%</span></div>
                    <span className="text-2xl text-white/60 font-playfair italic mt-2 tracking-widest">Love Intensity</span>
                </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5"><motion.div className="h-full bg-gradient-to-r from-red-500 to-pink-500" animate={{ width: `${progress}%` }} /></div>
        </motion.div>
    );
};

// --- Step 4: Cake Blowing ---
const CakeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [blown, setBlown] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);
    const [blowLevel, setBlowLevel] = useState(0);

    useEffect(() => {
        let audioContext: AudioContext;
        let microphone: MediaStreamAudioSourceNode;
        let analyser: AnalyserNode;
        let animationFrame: number;

        const initMic = async () => {
            try {
                // Feature detection
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
                        setBlown(true);
                        playAudio('blow.mp3');
                        setTimeout(() => onComplete(), 3000);
                    } else if (!blown) {
                        animationFrame = requestAnimationFrame(checkBlow);
                    }
                };
                checkBlow();
            } catch (err) {
                console.log("Mic access denied or error:", err);
                // We fallback gracefully, user can just click the cake
            }
        };
        initMic();

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (audioContext) audioContext.close();
        };
    }, [blown, onComplete]);

    const manualBlow = () => {
        if (blown) return;
        setBlown(true);
        playAudio('blow.mp3');
        setTimeout(() => onComplete(), 3000);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center space-y-12 w-full max-w-lg px-6 relative z-10">
            <h2 className="text-5xl font-playfair text-white text-center drop-shadow-lg leading-tight">
                {blown ? "Make a Wish! ✨" : (micEnabled ? "Tiup lilinnya!" : "Ketuk lilinnya untuk meniup!")}
            </h2>
            
            <div className="relative cursor-pointer" onClick={manualBlow}>
                {/* Simple SVG Cake */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                    {/* Cake Base */}
                    <rect x="30" y="100" width="140" height="70" rx="10" fill="#fcd34d" />
                    <rect x="20" y="90" width="160" height="20" rx="10" fill="#f472b6" />
                    <path d="M 30,120 Q 50,140 70,120 T 110,120 T 150,120 T 170,120" fill="none" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" />
                    
                    {/* Candle */}
                    <rect x="95" y="40" width="10" height="50" rx="2" fill="#e2e8f0" />
                    <rect x="95" y="45" width="10" height="5" fill="#ef4444" />
                    <rect x="95" y="60" width="10" height="5" fill="#ef4444" />
                    <rect x="95" y="75" width="10" height="5" fill="#ef4444" />

                    {/* Flame */}
                    <AnimatePresence>
                        {!blown && (
                            <motion.path 
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -5, 5, -2, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                                exit={{ scale: 0, opacity: 0 }}
                                d="M 100,10 C 110,25 115,35 100,40 C 85,35 90,25 100,10 Z" 
                                fill="#fbbf24" 
                            />
                        )}
                    </AnimatePresence>
                </svg>

                {/* Confetti if blown */}
                <AnimatePresence>
                    {blown && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Sparkles className="w-24 h-24 text-yellow-400 animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mic Indicator */}
                {!blown && micEnabled && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono flex items-center gap-2">
                        Mic: <div className="h-2 w-20 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-400" style={{ width: `${Math.min(100, blowLevel)}%` }} /></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Step 5: Typewriter ---
const TypewriterStep = ({ onComplete }: { onComplete: () => void }) => {
    const text = "Happy Birthday!!!!";
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isDeleting && displayedText !== text) {
            timer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, 150);
        } else if (!isDeleting && displayedText === text) {
            timer = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && displayedText !== "") {
            timer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length - 1));
            }, 80);
        } else if (isDeleting && displayedText === "") {
            onComplete();
        }
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, onComplete, text]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }} className="flex items-center justify-center p-8 relative z-10 w-full">
            <h1 className="text-5xl sm:text-8xl font-playfair text-white text-center leading-tight">
                {displayedText}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 sm:w-4 h-12 sm:h-20 bg-red-500 ml-2 align-middle" />
            </h1>
        </motion.div>
    );
};

export default function InteractionFlow({ onFlowComplete }: { onFlowComplete: () => void }) {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 z-50 bg-[#060010] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <BackgroundHearts />

            <AnimatePresence mode="wait">
                {step === 1 && <LoveModeStep key="step1" onComplete={() => setStep(2)} />}
                {step === 2 && <TicTacToeStep key="step2" onComplete={() => setStep(3)} />}
                {step === 3 && <LoveMeterStep key="step3" onComplete={() => setStep(4)} />}
                {step === 4 && <CakeStep key="step4" onComplete={() => setStep(5)} />}
                {step === 5 && <TypewriterStep key="step5" onComplete={() => onFlowComplete()} />}
            </AnimatePresence>

            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-900/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-900/20 blur-[100px] rounded-full" />
        </div>
    );
}
