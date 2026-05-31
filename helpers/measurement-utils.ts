/**
 * Generates options in 1-inch steps, but saves the value converted to CM.
 * Example: 5' 0" (60 inches) -> saves "152.4" cm to database
 */
export function generateHeightOptions() {
  const options = [];
  const minInches = 48; // 4' 0"
  const maxInches = 84; // 7' 0"

  for (let i = minInches; i <= maxInches; i++) {
    const feet = Math.floor(i / 12);
    const inches = i % 12;
    const cmValue = (i * 2.54).toFixed(1);

    options.push({
      value: cmValue,
      label: `${feet}' ${inches}"`,
    });
  }
  return options;
}

/**
 * Generates options in 1-lb steps, but saves the value converted to KG.
 * Example: 150 lbs -> saves "68.0" kg to database
 */
export function generateWeightOptions() {
  const options = [];
  const minKg = 40;
  const maxKg = 180;

  for (let w = minKg; w <= maxKg; w++) {
    options.push({
      value: w.toString(),
      label: `${w} kg`,
    });
  }
  return options;
}
