import { describe, expect, it } from 'vitest';
import { nextChristmas } from './christmas';

describe('nextChristmas', () => {
  it('uses December 25 of the same year before Christmas', () => {
    expect(nextChristmas(new Date(2026, 10, 17, 14, 0, 0))).toEqual(
      new Date(2026, 11, 25, 0, 0, 0, 0)
    );
  });

  it('stays on Christmas Day so the countdown reads as today', () => {
    expect(nextChristmas(new Date(2026, 11, 25, 0, 0, 0))).toEqual(
      new Date(2026, 11, 25, 0, 0, 0, 0)
    );
    expect(nextChristmas(new Date(2026, 11, 25, 15, 30, 0))).toEqual(
      new Date(2026, 11, 25, 0, 0, 0, 0)
    );
  });

  it('rolls to the next year on December 26', () => {
    expect(nextChristmas(new Date(2026, 11, 26, 0, 0, 0))).toEqual(
      new Date(2027, 11, 25, 0, 0, 0, 0)
    );
  });

  it('uses the upcoming Christmas after New Year', () => {
    expect(nextChristmas(new Date(2027, 0, 1, 0, 0, 0))).toEqual(
      new Date(2027, 11, 25, 0, 0, 0, 0)
    );
  });
});
