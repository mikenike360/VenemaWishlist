import React from 'react';
import { useChristmasCountdown } from '../hooks/useChristmasCountdown';

const Countdown: React.FC = () => {
  const timeLeft = useChristmasCountdown();

  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 md:gap-2 text-primary-content text-xs sm:text-sm md:text-lg lg:text-xl px-1 sm:px-2">
      <span className="text-base sm:text-xl md:text-2xl">🎅</span>
      <span className="text-[10px] sm:text-xs md:text-sm lg:text-base">Time until Christmas:</span>
      <div className="flex gap-0.5 sm:gap-1 md:gap-2 flex-wrap justify-center">
        <div className="badge badge-warning badge-xs sm:badge-sm md:badge-lg font-bold text-[10px] sm:text-xs md:text-sm">
          {timeLeft.days}d
        </div>
        <div className="badge badge-warning badge-xs sm:badge-sm md:badge-lg font-bold text-[10px] sm:text-xs md:text-sm">
          {timeLeft.hours}h
        </div>
        <div className="badge badge-warning badge-xs sm:badge-sm md:badge-lg font-bold text-[10px] sm:text-xs md:text-sm">
          {timeLeft.minutes}m
        </div>
        <div className="badge badge-warning badge-xs sm:badge-sm md:badge-lg font-bold text-[10px] sm:text-xs md:text-sm animate-pulse">
          {timeLeft.seconds}s
        </div>
      </div>
      <span className="text-base sm:text-xl md:text-2xl">🎄</span>
    </div>
  );
};

export default Countdown;
