import React, { useEffect } from 'react';
import { Lighting } from './Lighting';
import { CameraControls, OrbitHold } from './CameraControls';
import { ChristmasTree } from '../models/ChristmasTree';
import { LivingRoom } from '../models/LivingRoom';
import { PersonPresent } from '../models/PersonPresent';
import { PresentPerson, pilePlacement } from '../../../lib/profiles';
import { TREE_POSITION } from '../../../lib/roomLayout';
import { ensurePileMotion, setPileSearchIndex } from '../pileMotion';

interface SceneProps {
  people: PresentPerson[];
  query: string;
  focus: [number, number, number] | null;
  onSelect: (person: PresentPerson) => void;
  onReleaseCamera: () => void;
  orbit: React.MutableRefObject<OrbitHold>;
}

export const Scene: React.FC<SceneProps> = ({ people, query, focus, onSelect, onReleaseCamera, orbit }) => {
  const needle = query.trim().toLowerCase();
  const searching = needle.length > 0;
  const pileCount = people.length;

  useEffect(() => {
    ensurePileMotion(pileCount);
    if (!searching) {
      setPileSearchIndex(null);
      return;
    }
    // Prefer the camera-focused match when search lands on one person.
    if (focus) {
      for (let i = 0; i < pileCount; i++) {
        const pos = pilePlacement(i, pileCount).position;
        if (
          Math.abs(pos[0] - focus[0]) < 1e-4 &&
          Math.abs(pos[1] - focus[1]) < 1e-4 &&
          Math.abs(pos[2] - focus[2]) < 1e-4
        ) {
          setPileSearchIndex(i);
          return;
        }
      }
    }
    const first = people.findIndex((person) => person.name.toLowerCase().includes(needle));
    setPileSearchIndex(first >= 0 ? first : null);
  }, [searching, needle, people, pileCount, focus]);

  return (
    <>
      <Lighting />
      <LivingRoom />
      <ChristmasTree position={TREE_POSITION} />

      {people.map((person, index) => {
        const highlighted = searching && person.name.toLowerCase().includes(needle);
        const { position, yaw } = pilePlacement(index, pileCount);
        return (
          <PersonPresent
            key={person.id}
            person={person}
            index={index}
            pileCount={pileCount}
            position={position}
            yaw={yaw}
            highlighted={highlighted}
            dimmed={searching && !highlighted}
            onSelect={onSelect}
          />
        );
      })}

      <CameraControls focus={focus} onRelease={onReleaseCamera} orbit={orbit} />
    </>
  );
};
