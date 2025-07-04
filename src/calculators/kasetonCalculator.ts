// calculators/kasetonCalculator.ts

import { KasetonOptions } from '../types';

export function calculateKaseton(
  dimensions: { width: number; height: number },
  options: KasetonOptions,
  quantity: number
) {
  const surface = (dimensions.width * dimensions.height * quantity) / 1e6;
  
  // Ceny bazowe (bez mnożnika!)
  const basePrices = {
    kaseton_plexi: 1550,
    kaseton_dibond: 1400
  };
  
  const letterPrices = {
    podklejone: 0,
    zlicowane: 150,
    wystajace: 400,
    halo: 300
  };
  
  // Koszt podstawowy
  const materialCost = surface * basePrices[`kaseton_${options.type}`];
  
  // Koszt liter
  const lettersCost = surface * letterPrices[options.letterType];
  
  // Koszt oświetlenia
  let lightingCost = 0;
  if (options.lighting.type === 'led') {
    lightingCost = 200 * quantity; // Podstawowe LED
    if (options.lighting.power) {
      lightingCost += options.lighting.power * 2; // 2 zł/W
    }
  } else if (options.lighting.type === 'halo') {
    lightingCost = 400 * quantity; // Oświetlenie halo
  }
  
  return {
    surface,
    materialCost,
    lettersCost,
    lightingCost,
    totalCost: materialCost + lettersCost + lightingCost,
    thickness: 3, // Stała grubość
    components: [{
      name: 'Kaseton',
      type: 'wall',
      dimensions: { ...dimensions, depth: 0 },
      surface,
      weight: surface * 3 * 1.19, // 3mm × gęstość plexi
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost
    }]
  };
}

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

export function calculateKaseton(options: KasetonOptions): CalculationResult {
  // Powierzchnia frontu w m²
  const surface = (options.width * options.height * options.quantity) / 1_000_000;
  
  // Koszt podstawowy (bez mnożnika!)
  const baseCost = surface * KASETON_PRICES[options.type];
  
  // Koszt liter
  const lettersCost = surface * LETTER_PRICES[options.letterType];
  
  // Koszt oświetlenia
  let lightingCost = LIGHTING_PRICES[options.lighting.type] * options.quantity;
  if (options.lighting.type !== 'none' && options.lighting.power) {
    lightingCost += options.lighting.power * 2; // 2 zł/W
  }
  
  // Koszt grafiki
  const graphicsCost = options.graphics ? surface * 75 : 0;
  
  // Waga (przybliżona)
  const weight = surface * 3 * (options.type === 'plexi' ? 3.57 : 4.5) * options.quantity;
  
  const materialCost = baseCost;
  const addonsCost = lettersCost + lightingCost + graphicsCost;
  
  return {
    surface: surface * options.quantity,
    weight,
    materialCost,
    addonsCost,
    totalCost: materialCost + addonsCost,
    breakdown: {
      base: baseCost,
      letters: lettersCost,
      lighting: lightingCost,
      graphics: graphicsCost
    }
  };
}