import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from './Countdown';

interface HeaderProps {
  isPlaying?: boolean;
  volume?: number;
  muted?: boolean;
  toggleMusic?: () => void;
  toggleMute?: () => void;
  setVolume?: (volume: number) => void;
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon({ muted, level }: { muted: boolean; level: number }) {
  if (muted || level <= 0.001) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
        <path
          d="M5 9v6h2.5L12 19V5L7.5 9H5zm10.3 1.3l1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
      <path d="M5 9v6h2.5L12 19V5L7.5 9H5z" fill="currentColor" />
      {level > 0.3 && (
        <path d="M15.5 12a2.2 2.2 0 0 0-1.3-2v4a2.2 2.2 0 0 0 1.3-2z" fill="currentColor" />
      )}
      {level > 0.65 && (
        <path d="M17.2 7.4a5.2 5.2 0 0 1 0 9.2v-1.6a3.6 3.6 0 0 0 0-6V7.4z" fill="currentColor" />
      )}
    </svg>
  );
}

const Header: React.FC<HeaderProps> = ({
  isPlaying,
  volume = 0.5,
  muted = false,
  toggleMusic,
  toggleMute,
  setVolume,
}) => {
  const [showVolume, setShowVolume] = useState(false);
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
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={toggleMusic}
                className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                <PlayIcon playing={!!isPlaying} />
              </button>
              {toggleMute && (
                <button
                  type="button"
                  onClick={toggleMute}
                  className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
                  aria-label={muted || volume <= 0 ? 'Unmute' : 'Mute'}
                >
                  <VolumeIcon muted={!!muted} level={volume} />
                </button>
              )}
              {setVolume && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowVolume((open) => !open)}
                    className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
                    aria-label="Volume level"
                    aria-expanded={showVolume}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true">
                      <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
                    </svg>
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
