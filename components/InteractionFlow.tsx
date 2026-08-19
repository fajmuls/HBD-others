'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle } from 'lucide-react';

const playAudio = (path: string) => {
    try {
        const fallbacks: Record<string, string> = {
            'click.mp3': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            'tictactoe-click.mp3': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            'tictactoe-win.mp3': 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
            'love-mode.mp3': 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
        };
        const audio = new Audio(`/sfx/${path}`);
        audio.volume = 0.5;
        audio.play().catch(() => {
            if (fallbacks[path]) {
                const fb = new Audio(fallbacks[path]);
                fb.volume = 0.3;
                fb.play().catch(() => {});
            }
        });
    } catch (e) {
        // Safe to ignore
    }
};

// --- Background Particles ---
const BackgroundHearts = () => {
    const [hearts, setHearts] = useState<{id: number, x: string, duration: number, delay: number}[]>([]);
    
    useEffect(() => {
        const initialHearts = [...Array(10)].map((_, i) => ({
            id: i,
            x: `${(i * 10) + Math.random() * 5}%`,
            duration: 15 + Math.random() * 10,
            delay: i * 2
        }));
        setHearts(initialHearts);
    }, []);

    if (hearts.length === 0) return null;
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {hearts.map((h) => (
                <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: '110vh', x: h.x, scale: 0.5 }}
                    animate={{ opacity: [0, 0.2, 0], y: '-10vh', rotate: [0, 180], scale: [0.5, 0.8, 0.5] }}
                    transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: "linear" }}
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
                    <span className={`text-3xl md:text-5xl font-playfair transition-colors duration-1000 ${isOn ? 'text-white' : 'text-white/40'}`}>Love mode</span>
                    <button onClick={() => setIsOn(!isOn)} className={`group relative w-24 h-12 md:w-32 md:h-16 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-1.5 focus:outline-none ${isOn ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}>
                        <motion.div animate={{ x: isOn ? (window.innerWidth < 768 ? 48 : 64) : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="w-9 h-9 md:w-13 md:h-13 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-none" style={{ width: 'calc(100% / 2.5)', height: '100%' }}>
                            <Heart size={18} className={`md:size-24 transition-colors duration-500 ${isOn ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
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

    const message = winner === 'X' ? "Kamu Memenangkan" : winner === 'draw' ? "Seri! Coba lagi yaa ❤️" : winner === 'O' ? "Hampir! Sekali lagi..." : "Let's play a little game...";

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
            playAudio('tictactoe-win.mp3');
            setTimeout(() => onComplete(), 3500);
        } else if (winner === 'O' || winner === 'draw') {
            setTimeout(() => { setBoard(Array(9).fill(null)); setWinner(null); setIsUserTurn(true); }, 1500);
        }
    }, [winner, onComplete]);

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center space-y-6 md:space-y-10 relative z-10 px-4">
            <h2 className="text-2xl md:text-4xl font-playfair text-white text-center drop-shadow-lg max-w-xs whitespace-pre-line leading-tight">{winner === 'X' ? "Kamu Memenangkan" : message}</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-3 p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                {board.map((square, i) => (
                    <button key={i} onClick={() => handleSquareClick(i)} className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all duration-300 group">
                        <AnimatePresence mode="wait">
                            {square === 'X' ? (
                                <motion.div key={winner === 'X' ? "heart" : "x"} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={winner === 'X' ? { delay: i * 0.15, type: 'spring' } : {}}>
                                    {winner === 'X' ? <Heart className="w-8 h-8 md:w-12 md:h-12 text-red-500 fill-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> : <X className="w-8 h-8 md:w-12 md:h-12 text-white/80" />}
                                </motion.div>
                            ) : square === 'O' ? (
                                <motion.div key="o" initial={{ scale: 0 }} animate={{ scale: 1 }}><Circle className="w-8 h-8 md:w-12 md:h-12 text-pink-300 opacity-50" /></motion.div>
                            ) : null}
                        </AnimatePresence>
                    </button>
                ))}
            </div>
            <AnimatePresence>
                {winner === 'X' && <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl font-playfair text-white text-center drop-shadow-lg mt-2">Hatiku</motion.h2>}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Step 3: Love Meter (Heart Fill) ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { 
                    clearInterval(interval); 
                    playAudio('tictactoe-win.mp3'); // Completion sound
                    setTimeout(() => onComplete(), 2000); 
                    return 100; 
                }
                // Play a subtle heartbeat sound at intervals
                if (prev % 20 === 0) playAudio('tictactoe-click.mp3');
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full max-w-sm px-6 relative z-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                {/* Background Heart (Empty) */}
                <Heart className="absolute w-full h-full text-white/5" fill="currentColor" strokeWidth={1} />
                
                {/* Filling Heart */}
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}>
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1] }} 
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    >
                        <Heart className="w-48 h-48 md:w-64 md:h-64 text-red-500 fill-red-500 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
                    </motion.div>
                </div>

                {/* Percentage Text */}
                <div className="z-20 flex flex-col items-center">
                    <motion.div 
                        key={progress}
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl md:text-5xl font-black text-white font-mono tracking-tighter"
                    >
                        {progress}<span className="text-red-400 text-xl md:text-2xl">%</span>
                    </motion.div>
                </div>
            </div>

            <div className="w-full space-y-3 px-4">
                <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/30">
                    <span>Intensity</span>
                    <span>{progress === 100 ? "MAXIMUM" : "CALCULATING..."}</span>
                </div>
                <div className="w-full h-1 md:h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-red-600 via-pink-500 to-red-600" 
                        animate={{ width: `${progress}%` }} 
                        transition={{ duration: 0.1 }}
                    />
                </div>
            </div>
            
            <p className="text-xs md:text-sm text-white/40 font-playfair italic text-center animate-pulse px-6 leading-relaxed">
                &quot;My heart beats faster when I&apos;m with you...&quot;
            </p>
        </motion.div>
    );
};

// --- Step 4: Typewriter ---
const TypewriterStep = ({ onComplete }: { onComplete: () => void }) => {
    const text = "Happy Birthday Kak Arey";
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
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-playfair text-white text-center leading-tight">
                {displayedText}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 md:w-4 h-10 md:h-20 bg-red-500 ml-2 align-middle" />
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
                {step === 4 && <TypewriterStep key="step4" onComplete={() => onFlowComplete()} />}
            </AnimatePresence>

            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-900/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-900/20 blur-[100px] rounded-full" />
        </div>
    );
}
