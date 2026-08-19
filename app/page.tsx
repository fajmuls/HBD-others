'use client';

import { useState } from 'react';
import DomeGallery from '@/components/DomeGallery';
import InteractionFlow from '@/components/InteractionFlow';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);

  const userImages = [
    '/1.jpeg',
    '/2.jpeg',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
    '/7.jpeg',
    '/8.jpeg',
    '/9.jpeg',
    '/10.jpeg',
    '/11.jpeg',
    '/12.jpeg',
    '/13.jpeg',
    '/14.jpeg',
    '/15.jpeg',
  ];

  return (
    <main className="w-screen h-screen bg-[#060010]">
      {!showGallery ? (
        <InteractionFlow onFlowComplete={() => setShowGallery(true)} />
      ) : (
        <>
          <audio src="/pretty.mp3" autoPlay loop className="hidden" />
          <DomeGallery
            images={userImages}
            fit={0.8}
            minRadius={600}
            maxVerticalRotationDeg={0}
            segments={34}
            dragDampening={2}
            grayscale={false}
            autoRotationSpeed={0.1}
          />
        </>
      )}
      <Link 
        href="/admin" 
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all backdrop-blur-sm"
        aria-label="Admin Dashboard"
      >
        <Settings size={18} />
      </Link>
    </main>
  );
}
