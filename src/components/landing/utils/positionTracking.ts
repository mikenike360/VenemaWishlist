// Shared position tracking for person-to-person collision detection
export const peoplePositions = new Map<string, { x: number; z: number }>();
export const skaterPositions = new Map<string, { x: number; z: number }>();

let personIdCounter = 0;
let skaterIdCounter = 0;

export const getNextPersonId = (): string => {
  return `person-${personIdCounter++}`;
};

export const getNextSkaterId = (): string => {
  return `skater-${skaterIdCounter++}`;
};

