'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  
  const links = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/letter', icon: BookHeart, label: 'Story' },
    { path: '/memories', icon: ImageIcon, label: 'Memories' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`relative p-3 rounded-full flex items-center justify-center transition-colors group ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'}`}
              title={link.label}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-pill" 
                  className="absolute inset-0 bg-red-500/50 rounded-full blur-[2px]" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <link.icon size={22} className="relative z-10 transition-transform group-hover:scale-110" />
            </Link>
          )
        })}
      </div>
    </div>
  );
}
