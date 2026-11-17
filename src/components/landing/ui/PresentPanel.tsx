import React from 'react';
import CopyLinkButton from '../../CopyLinkButton';
import { PresentPerson } from '../../../lib/profiles';

interface PresentPanelProps {
  person: PresentPerson;
  onClose: () => void;
}

export const PresentPanel: React.FC<PresentPanelProps> = ({ person, onClose }) => {
  return (
    <div className="pointer-events-auto absolute right-3 top-28 z-30 w-[min(20rem,calc(100%-1.5rem))] rounded-2xl bg-base-100 p-4 text-base-content shadow-2xl sm:right-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold">{person.name}</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
          Close
        </button>
      </div>
      {person.image ? (
        <img
          src={person.image}
          alt={person.name}
          className="mx-auto mb-4 h-36 w-36 rounded-full border-4 border-base-300 object-cover shadow"
        />
      ) : (
        <div className="mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-content">
          {person.name.charAt(0)}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <a
          href={person.wishlistLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-accent font-bold"
        >
          View Wishlist
        </a>
        <CopyLinkButton url={person.wishlistLink} label="Copy Link" className="w-full" />
      </div>
    </div>
  );
};
