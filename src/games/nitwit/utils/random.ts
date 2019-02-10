/**
 * Get a random integer in the interval from min to max, inclusive.
 * @param min The min value of the interval, _inclusive_
 * @param max The max value of the interval, _inclusive_
 */
export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
