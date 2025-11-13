import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const christmas = new Date('December 25, 2024 00:00:00');
    const now = new Date();
    const difference = christmas.getTime() - now.getTime();

    return {
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-primary-content text-lg md:text-xl">
      <span className="text-2xl">🎅</span>
      <span>Time until Christmas:</span>
      <div className="flex gap-2 flex-wrap justify-center">
        <div className="badge badge-warning badge-lg font-bold">
          {timeLeft.days}d
        </div>
        <div className="badge badge-warning badge-lg font-bold">
          {timeLeft.hours}h
        </div>
        <div className="badge badge-warning badge-lg font-bold">
          {timeLeft.minutes}m
        </div>
        <div className="badge badge-warning badge-lg font-bold animate-pulse">
          {timeLeft.seconds}s
        </div>
      </div>
      <span className="text-2xl">🎄</span>
    </div>
  );
};

export default Countdown;

