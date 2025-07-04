// calculators/impulsCalculator.ts

import { ImpulsOptions, ComponentCalculation } from '../types';
import { IMPULS_LIMITER_HEIGHT } from '../constants/pricing';

export function calculateImpulsKasowy(
  dimensions: { width: number; height: number; depth: number },
  options: ImpulsOptions,
  material: { pricePerM2: number; density: number }
) {
  const components: ComponentCalculation[] = [];
  const { width, height, depth } = dimensions;
  
  // 1. Plecy (plexi bezbarwna lub biała)
  const backMaterial = options.plexiType === 'white' ? material.pricePerM2 * 1.1 : material.pricePerM2;
  components.push({
    name: 'Plecy',
    type: 'wall',
    dimensions: { width, height, depth: 0 },
    surface: (width * height) / 1e6,
    weight: 0,
    edgeLength: 2 * (width + height) / 1000,
    materialCost: 0
  });
  
  // 2. Boki (zawsze plexi bezbarwna)
  components.push({
    name: 'Lewy bok',
    type: 'wall',
    dimensions: { width: depth, height, depth: 0 },
    surface: (depth * height) / 1e6,
    weight: 0,
    edgeLength: 2 * (depth + height) / 1000,
    materialCost: 0
  });
  
  components.push({
    name: 'Prawy bok',
    type: 'wall',
    dimensions: { width: depth, height, depth: 0 },
    surface: (depth * height) / 1e6,
    weight: 0,
    edgeLength: 2 * (depth + height) / 1000,
    materialCost: 0
  });
  
  // 3. Półki z ogranicznikami (min. 2)
  const shelvesCount = Math.max(2, options.shelvesCount);
  
  for (let i = 0; i < shelvesCount; i++) {
    // Półka główna
    components.push({
      name: `Półka ${i + 1}`,
      type: 'shelf',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Ogranicznik 60mm (element zgięty)
    components.push({
      name: `Ogranicznik półki ${i + 1}`,
      type: 'shelf',
      dimensions: { width, height: IMPULS_LIMITER_HEIGHT, depth: 0 },
      surface: (width * IMPULS_LIMITER_HEIGHT) / 1e6,
      weight: 0,
      edgeLength: width / 1000, // Tylko górna krawędź
      materialCost: 0
    });
  }
  
  // Oblicz całkowitą powierzchnię
  const totalSurface = components.reduce((sum, c) => sum + c.surface, 0);
  
  // Oblicz koszt materiału z mnożnikiem 1.8
  const materialCost = totalSurface * material.pricePerM2 * options.thickness * 1.8;
  
  // Koszt gięcia ograniczników (liczba półek × szerokość)
  const bendingLength = shelvesCount * width / 1000; // metry
  const bendingCost = getBendingPrice(options.thickness) * bendingLength;
  
  // Grafika (bez mnożnika!)
  let graphicsCost = 0;
  const backSurface = (width * height) / 1e6;
  
  if (options.graphics.type === 'single') {
    graphicsCost = backSurface * 75;
  } else if (options.graphics.type === 'double') {
    graphicsCost = backSurface * 150;
  }
  
  return {
    components,
    materialCost,
    bendingCost,
    graphicsCost,
    totalCost: materialCost + bendingCost + graphicsCost,
    multiplierUsed: 1.8
  };
}

function getBendingPrice(thickness: number): number {
  const prices: Record<number, number> = {
    2: 4, 3: 5, 4: 7, 5: 10, 6: 20, 8: 40, 10: 80
  };
  return prices[thickness] || 5;
}