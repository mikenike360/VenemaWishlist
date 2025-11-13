import React from 'react';
import Countdown from './Countdown';

const Header: React.FC = () => (
  <header className="header bg-primary text-primary-content shadow-lg">
    <div className="lights flex justify-center gap-2 mb-4">
      {[...Array(12)].map((_, index) => (
        <div 
          key={index} 
          className={`light light-${index % 4} w-4 h-4 rounded-full shadow-lg animate-pulse`}
          style={{ animationDelay: `${(index % 4) * 0.3}s` }}
        />
      ))}
    </div>
    <h1 className="header-title text-4xl md:text-5xl font-bold text-primary-content mb-4 drop-shadow-lg">
      The Venema Family Wishlist 🎁
    </h1>
    <Countdown />
  </header>
);

export default Header;

