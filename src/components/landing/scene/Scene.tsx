import React, { useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Lighting } from './Lighting';
import { CameraControls, OrbitHold } from './CameraControls';
import { SnowyGround } from '../environment/SnowyGround';
import { Snowflakes } from '../environment/Snowflakes';
import { ChristmasTree } from '../models/ChristmasTree';
import { LampPost } from '../models/LampPost';
import { SnowmanModel } from '../models/SnowmanModel';
import { Tree } from '../models/Tree';
import { SantaModel } from '../models/SantaModel';
import { ToyModel } from '../models/ToyModel';
import { PersonPresent } from '../models/PersonPresent';
import { SantaWorkshop } from '../models/SantaWorkshop';
import { Elf } from '../models/Elf';
import { PresentPerson, ringPosition } from '../../../lib/profiles';

function around(angle: number, radius: number, y = -0.5): [number, number, number] {
  return [Math.sin(angle) * radius, y, Math.cos(angle) * radius];
}

interface SceneProps {
  people: PresentPerson[];
  query: string;
  focus: [number, number, number] | null;
  onSelect: (person: PresentPerson) => void;
  onReleaseCamera: () => void;
  orbit: React.MutableRefObject<OrbitHold>;
}

export const Scene: React.FC<SceneProps> = ({ people, query, focus, onSelect, onReleaseCamera, orbit }) => {
  const { camera } = useThree();
  const [showWorkshop, setShowWorkshop] = useState(false);
  const threshold = -0.5; // Ground level threshold

  useFrame(() => {
    // Check if camera Y position is below ground level
    const cameraY = camera.position.y;
    const shouldShow = cameraY < threshold;
    
    if (shouldShow !== showWorkshop) {
      setShowWorkshop(shouldShow);
    }
  });

  return (
    <>
      <Lighting />
      
      {/* Ground */}
      <SnowyGround />
      
      {/* Snow */}
      <Snowflakes />
      
      {/* Tree */}
      {/* Y position adjusted so tree sits on ground (trunk bottom at -1 relative to group, ground at -0.5) */}
      <ChristmasTree position={[0, 0.5, 0]} scale={1.2} />
      
      {/* Snowmen stand on the outer ring, where the presents used to sit */}
      <SnowmanModel position={around(0.62, 7.3)} scale={0.85} rotation={[0, 0.62, 0]} />
      <SnowmanModel position={around(-0.62, 7.3)} scale={0.85} rotation={[0, -0.62, 0]} />

      {/* Elves spread around that same outer ring, facing away from the tree */}
      <Elf position={around(0.95, 7.2)} scale={0.7} rotation={[0, 0.95, 0]} workingPose="default" />
      <Elf position={around(-0.95, 7.2)} scale={0.7} rotation={[0, -0.95, 0]} workingPose="default" />
      <Elf position={around(1.3, 7.2)} scale={0.75} rotation={[0, 1.3, 0]} workingPose="default" />
      <Elf position={around(-1.3, 7.2)} scale={0.75} rotation={[0, -1.3, 0]} workingPose="default" />
      <Elf position={around(2.55, 7.2)} scale={0.7} rotation={[0, 2.55, 0]} workingPose="default" />

      <Elf
        position={[-2.15, -0.5, 1.7]}
        scale={1.45}
        rotation={[0, 0.55, 0]}
        workingPose="sign"
        sign={'Click a present\nto open a wishlist'}
      />

      {/* Santa stands on the back of the outer ring */}
      <SantaModel position={around(-2.35, 7.3, -0.48)} scale={0.9} rotation={[0, -2.35, 0]} />
      
      {people.map((person, index) => {
        const needle = query.trim().toLowerCase();
        const highlighted = needle.length > 0 && person.name.toLowerCase().includes(needle);
        return (
          <PersonPresent
            key={person.id}
            person={person}
            position={ringPosition(index, people.length)}
            highlighted={highlighted}
            onSelect={onSelect}
          />
        );
      })}

      {/* Toys and lamps fill the rest of the outer ring */}
      <ToyModel position={around(1.65, 6.7, -0.48)} toyType="car" scale={1.0} rotation={[0, 0.5, 0]} noAnimation />
      <ToyModel position={around(2.0, 7.5, -0.48)} toyType="car" scale={1.0} rotation={[0, 0.3, 0]} noAnimation />
      <ToyModel position={around(2.85, 6.8, -0.48)} toyType="car" scale={1.0} rotation={[0, 1.2, 0]} noAnimation />
      <ToyModel position={around(-1.65, 6.7, -0.48)} toyType="car" scale={0.95} rotation={[0, -0.5, 0]} noAnimation />
      <ToyModel position={around(-2.0, 7.5, -0.48)} toyType="car" scale={1.0} rotation={[0, -0.3, 0]} noAnimation />
      <ToyModel position={around(-2.85, 6.8, -0.48)} toyType="car" scale={0.95} rotation={[0, -0.8, 0]} noAnimation />

      <LampPost position={around(1.9, 8.6)} />
      <LampPost position={around(-1.9, 8.6)} />
      
      {/* Background forest trees */}
      {/* Y position is -0.5 to match the ground plane position */}
      {/* Left side trees */}
      <Tree position={[-8, -0.5, -6]} scale={0.9} />
      <Tree position={[-10, -0.5, -4]} scale={1.1} />
      <Tree position={[-7, -0.5, -8]} scale={0.8} />
      <Tree position={[-12, -0.5, -7]} scale={1.0} />
      <Tree position={[-9, -0.5, -10]} scale={0.85} />
      
      {/* Right side trees */}
      <Tree position={[8, -0.5, -6]} scale={1.0} />
      <Tree position={[10, -0.5, -4]} scale={0.9} />
      <Tree position={[7, -0.5, -8]} scale={1.1} />
      <Tree position={[12, -0.5, -7]} scale={0.85} />
      <Tree position={[9, -0.5, -10]} scale={1.0} />
      
      {/* Center background trees */}
      <Tree position={[-2, -0.5, -8]} scale={0.9} />
      <Tree position={[2, -0.5, -8]} scale={1.1} />
      <Tree position={[0, -0.5, -10]} scale={0.95} />
      <Tree position={[-4, -0.5, -9]} scale={0.85} />
      <Tree position={[4, -0.5, -9]} scale={1.0} />
      
      {/* Far background trees - smaller */}
      <Tree position={[-6, -0.5, -12]} scale={0.7} />
      <Tree position={[6, -0.5, -12]} scale={0.75} />
      <Tree position={[-3, -0.5, -13]} scale={0.8} />
      <Tree position={[3, -0.5, -13]} scale={0.7} />
      <Tree position={[0, -0.5, -14]} scale={0.75} />
      
      {/* Camera Controls */}
      <CameraControls focus={focus} onRelease={onReleaseCamera} orbit={orbit} />
      
      {/* Santa's Workshop - only visible when camera pans below ground */}
      {showWorkshop && <SantaWorkshop />}
    </>
  );
};

