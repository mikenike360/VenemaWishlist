import React, { useState } from 'react';
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

const padBtn =
  'flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a06a]/40 bg-[#2a1810]/78 text-[#f3ead7] shadow-lg backdrop-blur-md transition hover:bg-[#3a2418]/9 sm:h-11 sm:w-11';

export const OrbitPad: React.FC<OrbitPadProps> = ({ orbit }) => {
  const [open, setOpen] = useState(false);

  const hold = (direction: keyof OrbitHold, down: boolean) => {
    orbit.current[direction] = down;
  };

  const clearHolds = () => {
    orbit.current.left = false;
    orbit.current.right = false;
    orbit.current.up = false;
    orbit.current.down = false;
  };

  return (
    <div className="pointer-events-auto absolute bottom-16 left-3 z-20 sm:bottom-20 sm:left-5">
      {!open ? (
        <button
          type="button"
          className={padBtn}
          aria-label="Show camera controls"
          aria-expanded={false}
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
          </svg>
        </button>
      ) : (
        <div className="relative grid grid-cols-3 grid-rows-3 gap-1 sm:gap-1.5">
          <button
            type="button"
            className="col-start-3 row-start-1 flex h-8 w-8 items-center justify-center justify-self-end rounded-full border border-[#c9a06a]/35 bg-[#2a1810]/7 text-[#f3ead7]/85 shadow backdrop-blur-md transition hover:bg-[#3a2418]/9"
            aria-label="Hide camera controls"
            aria-expanded={true}
            onClick={() => {
              clearHolds();
              setOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6.4 6.4l11.2 11.2m0-11.2L6.4 17.6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {buttons.map((button) => (
            <button
              key={button.direction}
              type="button"
              aria-label={button.label}
              className={`${button.place} ${padBtn}`}
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
                <path
                  d={button.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
