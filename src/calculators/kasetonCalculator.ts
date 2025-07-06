// calculators/kasetonCalculator.ts

import { KasetonOptions } from '../types/product.types';
import { CalculationResult } from '../types/calculator.types';

const KASETON_PRICES = {
  plexi: 1550, // zł/m²
  dibond: 1400 // zł/m²
};

const LETTER_PRICES = {
  podklejone: 0,
  zlicowane: 150,
  wystajace: 400,
  halo: 300
};

const LIGHTING_PRICES = {
  none: 0,
  led: 200,
  neon: 400
};

export function calculateKaseton(
  dimensions: { width: number; height: number },
  options: KasetonOptions,
  quantity: number
): CalculationResult {
  // Powierzchnia frontu w m²
  const surface = (dimensions.width * dimensions.height) / 1_000_000;
  
  // Koszt podstawowy (bez mnożnika!)
  const materialKey = options.type as keyof typeof KASETON_PRICES;
  const baseCost = surface * KASETON_PRICES[materialKey] * quantity;
  
  // Koszt liter
  const letterKey = options.letterType as keyof typeof LETTER_PRICES;
  const lettersCost = surface * LETTER_PRICES[letterKey] * quantity;
  
  // Koszt oświetlenia
  const lightingType = options.lighting || 'none';
  const lightingKey = (typeof lightingType === 'string' ? lightingType : 'none') as keyof typeof LIGHTING_PRICES;
  let lightingCost = LIGHTING_PRICES[lightingKey] * quantity;
  
  // Waga (przybliżona)
  const weight = surface * 3 * (options.type === 'plexi' ? 3.57 : 4.5) * quantity;
  
  const materialCost = baseCost;
  const addonsCost = lettersCost + lightingCost;
  const totalCost = materialCost + addonsCost;
  
  return {
    surface: surface * quantity,
    weight,
    materialCost,
    addonsCost,
    lightingCost,
    totalCost,
    unitCost: totalCost / quantity,
    breakdown: {
      base: baseCost,
      letters: lettersCost,
      lighting: lightingCost
    },
    components: [{
      name: 'Kaseton',
      type: 'other' as const,
      surface
    }]
  };
}