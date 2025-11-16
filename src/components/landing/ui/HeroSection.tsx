import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-4 sm:mb-6 animate-fade-in">
      <div className="inline-block mb-2 sm:mb-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-1 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] tracking-tight">
          <span className="inline-block animate-bounce-slow">🎁</span>{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
            The Family
          </span>
        </h1>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 mb-2 sm:mb-3 drop-shadow-[0_4px_20px_rgba(255,215,0,0.5)] tracking-wide">
        Wishlist
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-white/95 mb-2 max-w-3xl mx-auto font-medium leading-relaxed">
        Click the Christmas tree to get started
      </p>
    </div>
  );
};

