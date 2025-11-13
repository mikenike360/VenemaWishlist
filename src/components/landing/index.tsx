import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/Scene';
import { HeroSection } from './ui/HeroSection';
import { LandingStyles } from './ui/LandingStyles';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 pt-6 sm:pt-8 md:pt-12 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl">
          <HeroSection />
        </div>
      </div>

      {/* Custom animations */}
      <LandingStyles />
    </div>
  );
};

export default LandingPage;

