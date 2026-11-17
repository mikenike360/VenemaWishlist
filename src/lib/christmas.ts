/** Local midnight of the upcoming December 25. Christmas Day itself stays on that date. */
export function nextChristmas(from: Date = new Date()): Date {
  const year = from.getFullYear();
  const christmas = new Date(year, 11, 25, 0, 0, 0, 0);
  const afterChristmasDay =
    from.getMonth() > 11 || (from.getMonth() === 11 && from.getDate() > 25);

  if (afterChristmasDay) {
    return new Date(year + 1, 11, 25, 0, 0, 0, 0);
  }

  return christmas;
}
