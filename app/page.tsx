'use client';

import { useState } from 'react';
import DomeGallery from '@/components/DomeGallery';
import InteractionFlow from '@/components/InteractionFlow';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);

  const handleFlowComplete = () => {
    setShowGallery(true);
    // Explicitly play music if browser blocked it
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) audio.play().catch(() => {});
  };

  const userImages = [
    { src: '/1.jpeg', message: "Pertemuan pertama kita." },
    { src: '/2.jpeg', message: "Senyummu selalu membuat hariku lebih cerah." },
    { src: '/3.jpeg', message: "Momen lucu yang tak akan pernah kulupakan." },
    { src: '/4.jpeg', message: "Perjalanan kita masih panjang." },
    { src: '/5.jpeg', message: "Kamu adalah alasanku." },
    { src: '/6.jpeg', message: "Bersamamu semuanya terasa lebih mudah." },
    { src: '/7.jpeg', message: "Selalu jadi favoritku." },
    { src: '/8.jpeg', message: "Tatapan itu..." },
    { src: '/9.jpeg', message: "Setiap detiknya berharga." },
    { src: '/10.jpeg', message: "Kenangan manis di hari itu." },
    { src: '/11.jpeg', message: "Tawa yang selalu kurindukan." },
    { src: '/12.jpeg', message: "Bersamamu." },
    { src: '/13.jpeg', message: "Waktu seakan berhenti." },
    { src: '/14.jpeg', message: "Hanya kita berdua." },
    { src: '/15.jpeg', message: "I love you. Always." },
    { src: '/16.jpeg', message: "Momen spesial yang tak terlupakan." },
    { src: '/17.jpeg', message: "Masa depan cerah menanti kita." },
  ];

  return (
    <main className="w-screen h-screen bg-[#060010]">
      {!showGallery ? (
        <InteractionFlow onFlowComplete={handleFlowComplete} />
      ) : (
        <>
          <audio id="bg-music" src="/pretty.mp3" autoPlay loop className="hidden" />
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
          <Navigation />
        </>
      )}
    </main>
  );
}
