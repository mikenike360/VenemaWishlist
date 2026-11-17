import React from 'react';
import { OrbitHold } from '../scene/CameraControls';

interface OrbitPadProps {
  orbit: React.MutableRefObject<OrbitHold>;
}

const buttons: { direction: keyof OrbitHold; label: string; path: string; place: string }[] = [
  { direction: 'up', label: 'Tilt up', path: 'M6 14 L12 7 L18 14', place: 'col-start-2 row-start-1' },
  { direction: 'left', label: 'Rotate left around the tree', path: 'M14 6 L7 12 L14 18', place: 'col-start-1 row-start-2' },
  { direction: 'down', label: 'Tilt down', path: 'M6 10 L12 17 L18 10', place: 'col-start-2 row-start-3' },
  { direction: 'right', label: 'Rotate right around the tree', path: 'M10 6 L17 12 L10 18', place: 'col-start-3 row-start-2' },
];

export const OrbitPad: React.FC<OrbitPadProps> = ({ orbit }) => {
  const hold = (direction: keyof OrbitHold, down: boolean) => {
    orbit.current[direction] = down;
  };

  return (
    <div className="pointer-events-auto absolute bottom-16 left-3 z-20 grid grid-cols-3 grid-rows-3 gap-1 sm:bottom-20 sm:left-5 sm:gap-1.5">
      {buttons.map((button) => (
        <button
          key={button.direction}
          type="button"
          aria-label={button.label}
          className={`${button.place} flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-base-100 text-primary shadow-lg transition hover:bg-base-200 sm:h-11 sm:w-11`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            hold(button.direction, true);
          }}
          onPointerUp={() => hold(button.direction, false)}
          onPointerCancel={() => hold(button.direction, false)}
          onKeyDown={(event) => {
            if (event.key !== ' ' && event.key !== 'Enter') return;
            event.preventDefault();
            hold(button.direction, true);
          }}
          onKeyUp={(event) => {
            if (event.key !== ' ' && event.key !== 'Enter') return;
            hold(button.direction, false);
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d={button.path} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
};
