'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const MusicContext = createContext<{
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    playSFX: (url: string, volume?: number) => void;
} | null>(null);

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within MusicProvider');
    return context;
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/pretty.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.8;
            // Cross-browser persistence hint
            (audioRef.current as unknown as { preservesPitch: boolean }).preservesPitch = true;
        }
    }, []);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => {
                console.log("Autoplay prevented:", e);
                setIsPlaying(false);
            });
        }
    }, [isPlaying]);

    const playSFX = useCallback((url: string, volume: number = 0.5) => {
        try {
            const sfx = new Audio(url);
            sfx.volume = volume;
            sfx.play().catch(() => {});
        } catch (e) {
            console.error("SFX error:", e);
        }
    }, []);

    useEffect(() => {
        const handleInteraction = () => {
            if (isPlaying && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(() => {});
            }
            // Resume AudioContext if needed (for browsers that block it)
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };
        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [isPlaying]);

    return (
        <MusicContext.Provider value={{ isPlaying, setIsPlaying, playSFX }}>
            {children}
        </MusicContext.Provider>
    );
}
