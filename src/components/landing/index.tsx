import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/Scene';
import { HeroSection } from './ui/HeroSection';
import { LandingStyles } from './ui/LandingStyles';
import Header from '../Header';
import Footer from '../Footer';
import { useToast } from '../Toast';
import backgroundMusic from '../../assets/audio/jingle_bells.mp3';

const LandingPage: React.FC = () => {
  const { showToast } = useToast();

  // Music and theme state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(new Audio(backgroundMusic));
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('wishlist-theme');
    return savedTheme || 'winter';
  });
  const [showThemeList, setShowThemeList] = useState<boolean>(false);

  const themes = [
    'acid', 'aqua', 'autumn', 'black', 'bumblebee', 'business', 
    'coffee', 'corporate', 'cupcake', 'cmyk', 'cyberpunk', 'dark', 
    'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 
    'lemonade', 'light', 'lofi', 'luxury', 'night', 'pastel', 
    'retro', 'synthwave', 'valentine', 'wireframe', 'winter'
  ];

  // Effect to handle music play/pause and volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      audio.loop = true;
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  // Update theme and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wishlist-theme', theme);
  }, [theme]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
      <Header
        isPlaying={isPlaying}
        volume={volume}
        toggleMusic={toggleMusic}
        setVolume={setVolume}
        theme={theme}
        themes={themes}
        setTheme={setTheme}
        showThemeList={showThemeList}
        setShowThemeList={setShowThemeList}
        showToast={showToast}
      />
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 8, 14], fov: 60 }} 
          shadows
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Animated gradient overlay for better text readability */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-transparent to-slate-900/40 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end px-4 pb-20 sm:pb-24 md:pb-32 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl">
          <HeroSection />
        </div>
      </div>

      {/* Custom animations */}
      <LandingStyles />
      <Footer />
    </div>
  );
};

export default LandingPage;

