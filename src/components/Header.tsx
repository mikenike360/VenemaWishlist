import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from './Countdown';

interface HeaderProps {
  isPlaying?: boolean;
  volume?: number;
  toggleMusic?: () => void;
  setVolume?: (volume: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  isPlaying,
  volume,
  toggleMusic,
  setVolume,
}) => {
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-primary-content shadow-lg">
      <div className="lights" aria-hidden="true">
        {Array.from({ length: 17 }, (_, index) => (
          <span key={index} className={`light light-${index % 4}`} />
        ))}
      </div>
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="w-10 shrink-0 sm:w-28" aria-hidden="true" />
          <button
            type="button"
            onClick={() => navigate('/wishlist')}
            className="header-title min-w-0 flex-1 cursor-pointer text-center text-lg font-bold transition-opacity hover:opacity-80 sm:text-2xl"
          >
            <span className="hidden sm:inline">Venema Family Wishlist</span>
            <span className="sm:hidden">Venema Wishlist</span>
          </button>

          {toggleMusic && (
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={toggleMusic}
                className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              {setVolume && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowVolume(!showVolume)}
                    className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
                    aria-label="Volume"
                  >
                    🔊
                  </button>
                  {showVolume && (
                    <div className="absolute right-0 top-full z-50 mt-2 rounded-lg bg-base-100 p-3 text-base-content shadow-xl">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="range range-xs w-32"
                        aria-label="Volume level"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 sm:mt-3">
          <Countdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
