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
          <div className="absolute bottom-2 sm:bottom-4 text-error-content text-xs sm:text-sm font-bold animate-bounce px-2">
            Click to wrap!
          </div>
        )}
        {isHovered && isWrapped && (
          <div className="absolute bottom-2 sm:bottom-4 text-error-content text-xs sm:text-sm font-bold animate-bounce px-2">
            Click to open!
          </div>
        )}
      </div>
      <div className="card-back bg-success text-success-content overflow-hidden">
        <div className="flex flex-col items-center justify-between h-full p-1.5 sm:p-2.5 md:p-3 lg:p-4">
          <div className="flex flex-col items-center flex-1 justify-center min-h-0 w-full overflow-hidden">
            <img 
              src={user.image} 
              alt={`${user.name}'s Wishlist`} 
              className="user-image mb-0.5 sm:mb-1.5 md:mb-2 lg:mb-3 border-2 border-base-100 sm:border-3 md:border-4 shadow-xl transition-transform duration-300 hover:scale-110 flex-shrink-0" 
            />
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-success-content mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 drop-shadow-lg px-1 sm:px-2 text-center leading-tight line-clamp-2 break-words min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
              {user.name} 🎁
            </h2>
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1.5 items-center w-full px-0.5 sm:px-2 flex-shrink-0 mt-auto">
            <a 
              href={user.wishlistLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-warning btn-xs sm:btn-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full text-[10px] sm:text-xs md:text-sm lg:text-base py-0.5 sm:py-1.5 md:py-2 h-auto min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.25rem] lg:min-h-[2.5rem] whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="hidden sm:inline">View Wishlist</span>
              <span className="sm:hidden">View</span>
            </a>
            <CopyLinkButton 
              url={user.wishlistLink}
              label="Copy Link"
              className="btn-xs sm:btn-sm w-full text-[10px] sm:text-xs md:text-sm py-0.5 sm:py-1 h-auto min-h-[1.25rem] sm:min-h-[1.75rem] md:min-h-[2rem] whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;

