import React from 'react';
import Countdown from './Countdown';

const Header = () => (
  <header className="header">
    <div className="lights">
      {[...Array(12)].map((_, index) => (
        <div key={index} className={`light light-${index % 4}`} />
      ))}
    </div>
    <h1 className="header-title">The Venema Family Wishlist 🎁</h1>
    <Countdown />
  </header>
);

export default Header;

