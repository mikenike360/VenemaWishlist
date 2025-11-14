import React from 'react';
import Countdown from './Countdown';

const Header: React.FC = () => (
  <header className="header bg-primary text-primary-content shadow-lg px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5">
    <div className="lights flex justify-center gap-0.5 sm:gap-1 md:gap-2 mb-1.5 sm:mb-2 md:mb-4">
      {[...Array(12)].map((_, index) => (
        <div 
          key={index} 
          className={`light light-${index % 4} w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-lg animate-pulse`}
          style={{ animationDelay: `${(index % 4) * 0.3}s` }}
        />
      ))}
    </div>
    <h1 className="header-title text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-primary-content mb-1.5 sm:mb-2 md:mb-4 drop-shadow-lg px-1 sm:px-2 leading-tight">
      The Venema Family Wishlist 🎁
    </h1>
    <Countdown />
  </header>
);

export default Header;

