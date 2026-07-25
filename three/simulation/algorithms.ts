/**
 * Calculates global pollution level (0.0 to 1.0)
 * Higher carbon increases pollution, higher forest reduces it.
 */
export function calculatePollution(carbon: number, forest: number): number {
  const rawPollution = carbon * 1.5 - forest * 0.5;
  return Math.max(0, Math.min(1, rawPollution));
}

/**
 * Calculates overall city health score (0.0 to 1.0)
 * Higher education and healthcare increases health, higher poverty reduces it.
 */
export function calculateCityHealth(poverty: number, education: number, healthcare: number): number {
  return (education + healthcare + (1 - poverty)) / 3;
}
