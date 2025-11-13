import React from 'react';
import { Lighting } from './Lighting';
import { CameraControls } from './CameraControls';
import { SnowyGround } from '../environment/SnowyGround';
import { Snowflakes } from '../environment/Snowflakes';
import { ChristmasTree } from '../models/ChristmasTree';
import { LampPost } from '../models/LampPost';
import { Snowman } from '../models/Snowman';
import { Tree } from '../models/Tree';

export const Scene: React.FC = () => {
  return (
    <>
      <Lighting />
      
      {/* Ground */}
      <SnowyGround />
      
      {/* Snow */}
      <Snowflakes />
      
      {/* Tree */}
      <ChristmasTree position={[-2, 0, 0]} scale={1.2} />
      
      {/* Snowman */}
      <Snowman position={[3, 0, 1]} />
      
      {/* Lamp Posts */}
      <LampPost position={[-4, 0, -2]} />
      <LampPost position={[4, 0, -2]} />
      
      {/* Background forest trees */}
      {/* Left side trees */}
      <Tree position={[-8, 0, -6]} scale={0.9} />
      <Tree position={[-10, 0, -4]} scale={1.1} />
      <Tree position={[-7, 0, -8]} scale={0.8} />
      <Tree position={[-12, 0, -7]} scale={1.0} />
      <Tree position={[-9, 0, -10]} scale={0.85} />
      
      {/* Right side trees */}
      <Tree position={[8, 0, -6]} scale={1.0} />
      <Tree position={[10, 0, -4]} scale={0.9} />
      <Tree position={[7, 0, -8]} scale={1.1} />
      <Tree position={[12, 0, -7]} scale={0.85} />
      <Tree position={[9, 0, -10]} scale={1.0} />
      
      {/* Center background trees */}
      <Tree position={[-2, 0, -8]} scale={0.9} />
      <Tree position={[2, 0, -8]} scale={1.1} />
      <Tree position={[0, 0, -10]} scale={0.95} />
      <Tree position={[-4, 0, -9]} scale={0.85} />
      <Tree position={[4, 0, -9]} scale={1.0} />
      
      {/* Far background trees - smaller */}
      <Tree position={[-6, 0, -12]} scale={0.7} />
      <Tree position={[6, 0, -12]} scale={0.75} />
      <Tree position={[-3, 0, -13]} scale={0.8} />
      <Tree position={[3, 0, -13]} scale={0.7} />
      <Tree position={[0, 0, -14]} scale={0.75} />
      
      {/* Camera Controls */}
      <CameraControls />
    </>
  );
};

