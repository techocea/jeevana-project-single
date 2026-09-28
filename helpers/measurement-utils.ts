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
 * Converts a stored height in centimeters back to feet and inches.
 * Example: 152.4 -> { feet: 5, inches: 0, formatted: "5' 0\"" }
 */
export function convertCmToFeetInches(cm: string | number | null) {
  if (!cm) {
    return {
      feet: 0,
      inches: 0,
      formatted: `0' 0"`,
    };
  }

  const parsedCm = parseFloat(cm.toString());
  if (Number.isNaN(parsedCm)) {
    return {
      feet: 0,
      inches: 0,
      formatted: `0' 0"`,
    };
  }

  const totalInches = parsedCm / 2.54;
  const roundedInches = Math.round(totalInches);
  const feet = Math.floor(roundedInches / 12);
  const inches = roundedInches % 12;

  if (inches === 12) {
    return {
      feet: feet + 1,
      inches: 0,
      formatted: `${feet + 1}' 0"`,
    };
  }

  return {
    feet,
    inches,
    formatted: `${feet}' ${inches}"`,
  };
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
