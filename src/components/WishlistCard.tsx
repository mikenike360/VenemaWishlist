import React, { useState, useEffect } from 'react';
import { User } from '../types';
import CopyLinkButton from './CopyLinkButton';

interface WishlistCardProps {
  user: User;
  isFlipped: boolean;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ user, isFlipped }) => {
  const [isWrapped, setIsWrapped] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Sync local state with global flip state
  useEffect(() => {
    setIsWrapped(!isFlipped);
  }, [isFlipped]);

  const handleToggle = () => {
    setIsWrapped((prev) => !prev);
  };

  return (
    <div 
      className={`card ${isWrapped ? 'wrapped' : 'unwrapped'} transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-label={`${isWrapped ? 'Open' : 'Close'} ${user.name}'s wishlist card`}
    >
      <div className="card-front bg-error text-error-content">
        <div className={`present text-6xl transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          🎁
        </div>
        {isHovered && !isWrapped && (
          <div className="absolute bottom-4 text-error-content text-sm font-bold animate-bounce">
            Click to wrap!
          </div>
        )}
        {isHovered && isWrapped && (
          <div className="absolute bottom-4 text-error-content text-sm font-bold animate-bounce">
            Click to open!
          </div>
        )}
      </div>
      <div className="card-back bg-success text-success-content">
        <div className="flex flex-col items-center justify-center h-full p-4">
          <img 
            src={user.image} 
            alt={`${user.name}'s Wishlist`} 
            className="user-image mb-4 border-4 border-base-100 shadow-xl transition-transform duration-300 hover:scale-110" 
          />
          <h2 className="text-2xl font-bold text-success-content mb-4 drop-shadow-lg">
            {user.name} 🎁
          </h2>
          <div className="flex flex-col gap-2 items-center">
            <a 
              href={user.wishlistLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-warning btn-sm md:btn-md font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              View Wishlist
            </a>
            <CopyLinkButton 
              url={user.wishlistLink}
              label="Copy Link"
              className="btn-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;

