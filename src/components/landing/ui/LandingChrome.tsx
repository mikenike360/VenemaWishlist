import React, { useState } from 'react';
import { useChristmasCountdown } from '../../../hooks/useChristmasCountdown';

interface LandingChromeProps {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  toggleMusic: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon({ muted, level }: { muted: boolean; level: number }) {
  if (muted || level <= 0.001) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M5 9v6h2.5L12 19V5L7.5 9H5zm10.3 1.3l1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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

const panel =
  'rounded-xl border border-[#c9a06a]/35 bg-[#2a1810]/72 text-[#f3ead7] shadow-lg backdrop-blur-md';
const iconBtn =
  'pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f3ead7] transition hover:bg-[#f3ead7]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a06a]/70';

export function LandingChrome({
  isPlaying,
  volume,
  muted,
  toggleMusic,
  toggleMute,
  setVolume,
}: LandingChromeProps) {
  const timeLeft = useChristmasCountdown();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      {/* Spacer so countdown stays visually centered beside the finder */}
      <div className="hidden w-48 shrink-0 sm:block" aria-hidden="true" />

      <div className={`pointer-events-none mx-auto flex max-w-md flex-col items-center gap-0.5 px-3 py-2 ${panel}`}>
        <p className="font-semibold tabular-nums tracking-wide text-[#f3ead7] sm:text-lg">
          <span className="text-[#e2c08a]">{timeLeft.days}</span>
          <span className="ml-1.5 text-sm font-medium text-[#f3ead7]/90 sm:text-base">
            {timeLeft.days === 1 ? 'day' : 'days'}
          </span>
          <span className="ml-1.5 text-[#e2c08a]">{timeLeft.hours}</span>
          <span className="ml-1.5 text-sm font-medium text-[#f3ead7]/90 sm:text-base">
            {timeLeft.hours === 1 ? 'hour' : 'hours'} until Christmas
          </span>
        </p>
      </div>

      <div
        className={`pointer-events-auto flex shrink-0 items-center gap-1 px-2 py-1.5 ${panel} ${
          !isPlaying ? 'ring-2 ring-[#e2c08a]/70 shadow-[0_0_18px_rgba(226,192,138,0.35)]' : ''
        }`}
      >
        <button
          type="button"
          onClick={toggleMusic}
          className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a06a]/70 ${
            isPlaying
              ? 'bg-[#f3ead7]/10 text-[#f3ead7] hover:bg-[#f3ead7]/18'
              : 'bg-[#c9a06a] text-[#2a1810] hover:bg-[#e2c08a]'
          }`}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <PlayIcon playing={isPlaying} />
          <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play music'}</span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className={iconBtn}
          aria-label={muted || volume <= 0 ? 'Unmute' : 'Mute'}
        >
          <VolumeIcon muted={muted} level={volume} />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVolume((open) => !open)}
            className={iconBtn}
            aria-label="Volume level"
            aria-expanded={showVolume}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
            </svg>
          </button>
          {showVolume && (
            <div className="absolute right-0 top-full z-50 mt-2 rounded-lg border border-[#c9a06a]/35 bg-[#2a1810]/95 p-3 shadow-xl">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1.5 w-28 cursor-pointer accent-[#c9a06a]"
                aria-label="Volume level"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
