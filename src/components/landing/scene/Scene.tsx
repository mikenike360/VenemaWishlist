import React from 'react';
import { Lighting } from './Lighting';
import { CameraControls } from './CameraControls';
import { SnowyGround } from '../environment/SnowyGround';
import { Snowflakes } from '../environment/Snowflakes';
import { ChristmasTree } from '../models/ChristmasTree';
import { LampPost } from '../models/LampPost';
import { SnowmanModel } from '../models/SnowmanModel';
import { Tree } from '../models/Tree';
import { SantaModel } from '../models/SantaModel';
import { ToyModel } from '../models/ToyModel';
import { GiftModel } from '../models/GiftModel';

export const Scene: React.FC = () => {
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
      
      {/* Snowman - positioned in front of the Christmas tree */}
      {/* Y position is -0.5 to match the ground plane position */}
      <SnowmanModel position={[-1.5, -0.5, 3]} scale={0.85} />
      <SnowmanModel position={[1.5, -0.5, 3]} scale={0.85} />

      {/* Santa - positioned clearly visible */}
      {/* Y position adjusted so boots sit on ground (boots bottom at -0.02 relative to group, ground at -0.5) */}
      <SantaModel position={[-2, -0.48, -5]} scale={0.9} />
      
      {/* Gifts and Toys - scattered randomly throughout the scene */}
      {/* Near the tree */}
      <GiftModel position={[-1.2, -0.48, 0.5]} scale={0.9} rotation={[0, 0.4, 0]} noAnimation />
      <GiftModel position={[1.0, -0.48, -0.3]} scale={0.95} rotation={[0, -0.2, 0]} noAnimation />
      <GiftModel position={[0.8, -0.48, 0.8]} scale={0.88} rotation={[0, 0.6, 0]} noAnimation />
      
      {/* Around the snowmen */}
      <GiftModel position={[-2.0, -0.48, 2.8]} scale={0.92} rotation={[0, -0.3, 0]} noAnimation />
      <GiftModel position={[2.2, -0.48, 3.2]} scale={1.0} rotation={[0, 0.5, 0]} noAnimation />
      <GiftModel position={[-1.8, -0.48, 3.5]} scale={0.9} rotation={[0, -0.4, 0]} noAnimation />
      
      {/* Scattered around the scene */}
      <GiftModel position={[-3.5, -0.48, 1.5]} scale={0.9} rotation={[0, 0.3, 0]} noAnimation />
      <GiftModel position={[3.2, -0.48, 1.8]} scale={0.95} rotation={[0, -0.5, 0]} noAnimation />
      <GiftModel position={[-2.5, -0.48, -1.5]} scale={1.05} rotation={[0, 0.2, 0]} noAnimation />
      <GiftModel position={[2.8, -0.48, -1.2]} scale={0.87} rotation={[0, -0.6, 0]} noAnimation />
      <GiftModel position={[0.5, -0.48, 4.5]} scale={0.9} rotation={[0, 0.7, 0]} noAnimation />
      <GiftModel position={[-0.8, -0.48, 4.8]} scale={0.92} rotation={[0, -0.3, 0]} noAnimation />
      
      {/* Toys scattered around */}
      <ToyModel position={[-3.0, -0.48, 0.5]} toyType="car" scale={1.0} rotation={[0, 0.5, 0]} noAnimation />
      <ToyModel position={[-2.2, -0.48, 4.2]} toyType="car" scale={1.0} rotation={[0, 0.3, 0]} noAnimation />
      <ToyModel position={[0.0, -0.48, 5.0]} toyType="car" scale={1.0} rotation={[0, 1.2, 0]} noAnimation />
      <ToyModel position={[3.5, -0.48, 0.8]} toyType="car" scale={0.95} rotation={[0, -0.5, 0]} noAnimation />
      <ToyModel position={[2.5, -0.48, 4.5]} toyType="car" scale={1.0} rotation={[0, -0.3, 0]} noAnimation />
      <ToyModel position={[-1.5, -0.48, -2.5]} toyType="car" scale={0.95} rotation={[0, -0.8, 0]} noAnimation />
      
      {/* Lamp Posts */}
      {/* Y position is -0.5 to match the ground plane position */}
      <LampPost position={[-4, -0.5, -2]} />
      <LampPost position={[4, -0.5, -2]} />
      
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
      <CameraControls />
    </>
  );
};

