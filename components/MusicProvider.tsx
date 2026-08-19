'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const MusicContext = createContext<{
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
} | null>(null);

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within MusicProvider');
    return context;
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio once
        if (!audioRef.current) {
            audioRef.current = new Audio('/pretty.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.8; // User wants it loud/persistent
        }
    }, []);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => {
                console.log("Autoplay prevented or audio missing:", e);
                setIsPlaying(false);
            });
        } else if (!isPlaying && audioRef.current) {
            // We don't necessarily want to pause it if we want it "always play"
            // But if the user toggle it off, we should.
            // For now, let's just leave it playing if it started.
        }
    }, [isPlaying]);

    // Handle global interaction to start audio if blocked
    useEffect(() => {
        const handleInteraction = () => {
            if (isPlaying && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(() => {});
            }
        };
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [isPlaying]);

    return (
        <MusicContext.Provider value={{ isPlaying, setIsPlaying }}>
            {children}
        </MusicContext.Provider>
    );
}
