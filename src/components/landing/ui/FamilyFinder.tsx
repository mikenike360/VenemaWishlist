import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { PresentPerson } from '../../../lib/profiles';

interface FamilyFinderProps {
  people: PresentPerson[];
  query: string;
  onQueryChange: (query: string) => void;
  onPick: (person: PresentPerson) => void;
  onOpenPeople: () => void;
  peopleOpen: boolean;
}

const field =
  'w-full rounded-xl border border-[#c9a06a]/40 bg-[#2a1810]/75 px-3 py-2 text-sm text-[#f3ead7] shadow-lg backdrop-blur-md placeholder:text-[#f3ead7]/55 focus:border-[#e2c08a]/70 focus:outline-none focus:ring-2 focus:ring-[#c9a06a]/40';

export const FamilyFinder: React.FC<FamilyFinderProps> = ({
  people,
  query,
  onQueryChange,
  onPick,
  onOpenPeople,
  peopleOpen,
}) => {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return people.filter((person) => person.name.toLowerCase().includes(needle));
  }, [people, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const showList = open && query.trim().length > 0;

  const choose = (person: PresentPerson) => {
    onPick(person);
    onQueryChange(person.name);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto flex w-full max-w-md items-stretch gap-2 px-3 pt-2"
    >
      <div className="relative min-w-0 flex-1">
        <label className="sr-only" htmlFor={`${listId}-input`}>
          Search the family
        </label>
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          value={query}
          placeholder="Find family..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && matches[active] ? `${listId}-opt-${active}` : undefined}
          className={`${field} pr-8`}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              if (query) onQueryChange('');
              setOpen(false);
              return;
            }
            if (!showList || matches.length === 0) {
              if (event.key === 'Enter' && matches.length === 1) {
                event.preventDefault();
                choose(matches[0]);
              }
              return;
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActive((i) => (i + 1) % matches.length);
              return;
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((i) => (i - 1 + matches.length) % matches.length);
              return;
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              const person = matches[active] ?? matches[0];
              if (person) choose(person);
            }
          }}
        />
        {query && (
          <button
            type="button"
            className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#f3ead7]/80 transition hover:bg-[#f3ead7]/15"
            aria-label="Clear search"
            onClick={() => {
              onQueryChange('');
              setOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6.4 6.4l11.2 11.2m0-11.2L6.4 17.6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-40 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#c9a06a]/35 bg-[#2a1810]/95 py-1 text-[#f3ead7] shadow-xl backdrop-blur-md"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[#f3ead7]/70">No one matches that name.</li>
            ) : (
              matches.map((person, index) => (
                <li key={person.id} role="option" id={`${listId}-opt-${index}`} aria-selected={index === active}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm transition hover:bg-[#f3ead7]/12 ${
                      index === active ? 'bg-[#f3ead7]/15' : ''
                    }`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(person)}
                  >
                    {person.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <button
        type="button"
        className={`shrink-0 rounded-xl border px-3 text-sm font-semibold shadow-lg backdrop-blur-md transition ${
          peopleOpen
            ? 'border-[#e2c08a]/60 bg-[#6e2430]/90 text-[#f3ead7]'
            : 'border-[#c9a06a]/40 bg-[#5c3b24]/85 text-[#f3ead7] hover:bg-[#6e2430]/85'
        }`}
        aria-pressed={peopleOpen}
        onClick={onOpenPeople}
      >
        People
      </button>
    </div>
  );
};
