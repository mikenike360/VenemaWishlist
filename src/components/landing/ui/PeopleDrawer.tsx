import React from 'react';
import { PresentPerson } from '../../../lib/profiles';

interface PeopleDrawerProps {
  people: PresentPerson[];
  query: string;
  onPick: (person: PresentPerson) => void;
  onClose: () => void;
}

export const PeopleDrawer: React.FC<PeopleDrawerProps> = ({ people, query, onPick, onClose }) => {
  const needle = query.trim().toLowerCase();
  const visible = needle ? people.filter((person) => person.name.toLowerCase().includes(needle)) : people;

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 max-h-[55vh] overflow-hidden rounded-2xl bg-base-100 text-base-content shadow-2xl sm:inset-x-auto sm:left-6 sm:top-24 sm:bottom-auto sm:w-72">
      <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
        <h2 className="font-bold">People</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          Close
        </button>
      </div>
      <ul className="max-h-[45vh] overflow-y-auto p-2">
        {visible.length === 0 ? (
          <li className="px-3 py-4 text-sm text-base-content/70">No one matches that name.</li>
        ) : (
          visible.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                className="btn btn-ghost w-full justify-start"
                onClick={() => onPick(person)}
              >
                {person.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
