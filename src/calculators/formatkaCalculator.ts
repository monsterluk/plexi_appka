// src/calculators/formatkaCalculator.ts
import { FormatkaOptions } from '../types/product.types';
import { CalculationResult } from '../types/calculator.types';

interface MaterialPrices {
  [key: string]: number;
}

const MATERIAL_PRICES: MaterialPrices = {
  plexi: 30,
  hips: 25,
  petg: 35,
  pc: 45
};

const MATERIAL_DENSITIES: MaterialPrices = {
  plexi: 1.19,
  hips: 1.05,
  petg: 1.27,
  pc: 1.20
};

const ADDON_PRICES = {
  polishedEdges: 9, // zł/mb
  roundedCorners: 15, // zł/narożnik
  drillHoles: 2 // zł/otwór
};

export function calculateFormatka(options: FormatkaOptions): CalculationResult {
  // Wartości domyślne
  const width = options.width || 1000;
  const height = options.height || 500;
  const quantity = options.quantity || 1;
  const thickness = options.thickness || 3;
  
  // Powierzchnia w m²
  const surface = (width * height * quantity) / 1_000_000;
  
  // Koszt materiału
  const materialPricePerM2 = MATERIAL_PRICES[options.material];
  const materialCost = surface * materialPricePerM2 * thickness * 1.8; // mnożnik 1.8
  
  // Waga
  const density = MATERIAL_DENSITIES[options.material];
  const volume = surface * (thickness / 1000); // objętość w m³
  const weight = volume * density * 1000; // waga w kg
  
  // Koszty dodatków
  let addonsCost = 0;
  const breakdown: { [key: string]: number } = {};
  
  if (options.finishing?.polishedEdges) {
    const edgeLength = 2 * (width + height) / 1000 * quantity; // mb
    const polishingCost = edgeLength * ADDON_PRICES.polishedEdges;
    addonsCost += polishingCost;
    breakdown.polishedEdges = polishingCost;
  }
  
  if (options.finishing?.roundedCorners) {
    const cornersCost = 4 * quantity * ADDON_PRICES.roundedCorners;
    addonsCost += cornersCost;
    breakdown.roundedCorners = cornersCost;
  }
  
  if (options.finishing?.drillHoles && options.finishing.drillHoles > 0) {
    const holesCost = options.finishing.drillHoles * quantity * ADDON_PRICES.drillHoles;
    addonsCost += holesCost;
    breakdown.drillHoles = holesCost;
  }
  
  return {
    surface,
    weight,
    materialCost,
    addonsCost,
    totalCost: materialCost + addonsCost,
    breakdown
  };
}