import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from './Countdown';

interface HeaderProps {
  isPlaying?: boolean;
  volume?: number;
  toggleMusic?: () => void;
  setVolume?: (volume: number) => void;
  theme?: string;
  themes?: string[];
  setTheme?: (theme: string) => void;
  showThemeList?: boolean;
  setShowThemeList?: (show: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isPlaying = false, 
  volume = 0.5, 
  toggleMusic, 
  setVolume,
  theme = 'winter',
  themes = [],
  setTheme,
  showThemeList = false,
  setShowThemeList,
  showToast
}) => {
  const themeSelectorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle clicks outside theme selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeSelectorRef.current && !themeSelectorRef.current.contains(event.target as Node)) {
        setShowThemeList?.(false);
      }
    };

    if (showThemeList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeList, setShowThemeList]);

  return (
  <header className="header bg-primary text-primary-content shadow-lg px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5 relative z-[60]">
    <div className="lights flex justify-center gap-0.5 sm:gap-1 md:gap-2 mb-1.5 sm:mb-2 md:mb-4">
      {[...Array(12)].map((_, index) => (
        <div 
          key={index} 
          className={`light light-${index % 4} w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-lg animate-pulse`}
          style={{ animationDelay: `${(index % 4) * 0.3}s` }}
        />
      ))}
    </div>
    {/* Header Controls Row */}
    <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2 md:mb-4">
      {/* Left: Theme Switcher */}
      {setTheme && (
        <div className="relative flex-shrink-0" ref={themeSelectorRef}>
          <button 
            className="btn btn-xs sm:btn-sm md:btn-md btn-outline btn-circle sm:!rounded-lg sm:!w-auto sm:!min-w-[100px] gap-1 sm:gap-2 shadow-md hover:shadow-lg transition-all"
            onClick={() => setShowThemeList?.(!showThemeList)}
            aria-label="Change Theme"
          >
            <span className="text-base sm:text-lg">🎨</span>
            <span className="hidden sm:inline font-medium">Theme</span>
          </button>
          {showThemeList && themes.length > 0 && (
            <div className="absolute top-full left-0 mt-2 z-[100] animate-in fade-in slide-in-from-top-2">
              <div className="card bg-base-100 shadow-xl border-2 border-base-300">
                <div className="card-body p-2 max-h-96 overflow-y-auto w-48 sm:w-56">
                  <ul className="menu menu-vertical w-full">
                    {themes.map((t) => (
                      <li key={t}>
                        <button
                          onClick={() => {
                            setTheme(t);
                            setShowThemeList?.(false);
                            showToast?.(`Theme changed to ${t.charAt(0).toUpperCase() + t.slice(1)}`, 'info');
                          }}
                          className={`${theme === t ? 'active bg-primary text-primary-content' : 'hover:bg-base-200 text-base-content'} flex items-center justify-between text-sm font-medium rounded-lg transition-all px-3 py-2`}
                        >
                          <span className={theme === t ? 'text-primary-content' : 'text-base-content'}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                          {theme === t && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center: Title as Wishlist Link */}
      <button
        onClick={() => navigate('/wishlist')}
        className="header-title text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-primary-content drop-shadow-lg px-1 sm:px-2 leading-tight text-center flex-1 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 sm:gap-3"
        aria-label="Go to Wishlist"
        title="View Wishlist"
      >
        <span className="text-base sm:text-lg md:text-2xl lg:text-3xl">🛍️</span>
        <span>The Family Wishlist</span>
      </button>

      {/* Right: Music Controls */}
      {toggleMusic && (
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button 
            className={`btn btn-xs sm:btn-sm md:btn-md btn-circle sm:!rounded-lg sm:!w-auto sm:!min-w-[100px] ${isPlaying ? 'btn-error' : 'btn-success'} gap-1 sm:gap-2 shadow-md hover:shadow-lg transition-all font-semibold`}
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Stop Music' : 'Play Music'}
          >
            <span className="text-base sm:text-lg">{isPlaying ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline font-medium">{isPlaying ? 'Stop' : 'Play'}</span>
          </button>
          {isPlaying && setVolume && (
            <div className="hidden sm:flex items-center gap-2 bg-base-100/20 rounded-lg p-2 border border-base-100/30">
              <span className="text-sm">🔉</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="range range-xs range-warning w-20 md:w-24"
                aria-label="Volume"
              />
              <span className="text-xs font-semibold w-10 md:w-12">{Math.round(volume * 100)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
    <Countdown />
  </header>
  );
};

export default Header;

