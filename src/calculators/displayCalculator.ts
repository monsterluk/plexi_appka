// calculators/displayCalculator.ts

import { ComponentCalculation, CalculationResult } from '../types/calculator.types';
import { DisplayOptions } from '../types/product.types';

// Placeholder funkcje (tymczasowo)
const calculatePodstawkowy = (dimensions: any, options: any): ComponentCalculation[] => [];
const calculateSchodkowy = (dimensions: any, options: any): ComponentCalculation[] => [];
const calculateZHaczykami = (dimensions: any, options: any): ComponentCalculation[] => [];
const calculateKosmetyczny = (dimensions: any, options: any): ComponentCalculation[] => [];

export function calculateDisplay(
  dimensions: { width: number; height: number; depth: number },
  options: DisplayOptions & { thickness?: number; graphics?: 'none' | 'single' | 'double' },
  material: { pricePerM2: number }
) {
  const multipliers = {
    podstawkowy: 2.2,
    schodkowy: 2.5,
    z_haczykami: 2.4,
    wiszacy: 2.2,
    stojak: 2.5,
    kosmetyczny: 2.7
  };
  
  let components: ComponentCalculation[] = [];
  let additionalCosts = 0;
  
  switch (options.type) {
    case 'podstawkowy':
      components = calculatePodstawkowy(dimensions, options.specific);
      break;
    case 'schodkowy':
      components = calculateSchodkowy(dimensions, options.specific);
      break;
    case 'z_haczykami':
      components = calculateZHaczykami(dimensions, options.specific);
      if (options.specific.hooksCount) {
        additionalCosts += options.specific.hooksCount * 2; // 2 zł/haczyk
      }
      break;
    case 'kosmetyczny':
      components = calculateKosmetyczny(dimensions, options.specific);
      break;
    // ... inne typy
  }
  
  const totalSurface = components.reduce((sum, c) => sum + c.surface, 0);
  const thickness = options.thickness || 3; // domyślnie 3mm
  const materialCost = totalSurface * material.pricePerM2 * thickness * 
                      multipliers[options.type] * 1.12; // +12% odpad
  
  // Grafika (bez mnożnika)
  let graphicsCost = 0;
  if (options.graphics === 'single') {
    graphicsCost = totalSurface * 75;
  } else if (options.graphics === 'double') {
    graphicsCost = totalSurface * 150;
  }
  
  return {
    components,
    materialCost,
    additionalCosts,
    graphicsCost,
    totalCost: materialCost + additionalCosts + graphicsCost,
    multiplier: multipliers[options.type]
  };
}