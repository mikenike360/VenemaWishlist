import { useEffect, useState } from 'react';
import { TimeLeft } from '../types';
import { nextChristmas } from '../lib/christmas';

function calculateTimeLeft(): TimeLeft {
  const christmas = nextChristmas();
  const now = new Date();
  const difference = christmas.getTime() - now.getTime();

  return {
    days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
    seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
  };
}

export function useChristmasCountdown(): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}
