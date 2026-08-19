'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, Image as ImageIcon, Gift, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  
  useEffect(() => {
    const checkEnlarging = () => {
      const isEnlarging = document.querySelector('[data-enlarging="true"]') !== null || 
                          document.body.classList.contains('dg-scroll-lock') ||
                          document.querySelector('.enlarge') !== null;
      setIsHidden(isEnlarging);
    };

    const interval = setInterval(checkEnlarging, 100);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cake', icon: Gift, label: 'Cake' },
    { path: '/letter', icon: BookHeart, label: 'Story' },
    { path: '/memories', icon: ImageIcon, label: 'Memories' },
    { path: '/admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => {
                    try {
                      new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(() => {});
                    } catch { }
                  }}
                  className={`relative p-2 md:p-3 rounded-full flex items-center justify-center transition-colors group ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'}`}
                  title={link.label}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0 bg-red-500/50 rounded-full blur-[2px]" 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <link.icon size={18} className="md:size-[22px] relative z-10 transition-transform group-hover:scale-110" />
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
