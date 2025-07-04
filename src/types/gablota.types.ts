// types/gablota.types.ts

import { MaterialSpec } from './calculator.types';

export interface GablotaOptions {
  // Opcje podstawowe
  material: MaterialSpec;
  thickness: number;
  
  // Opcje dna/podstawy
  hasBase: boolean;
  baseMaterial?: MaterialSpec;
  baseThickness?: number;
  
  // Przegrody
  partitions: {
    enabled: boolean;
    horizontal: number;
    vertical: number;
  };
  
  // Opcje dodatkowe
  hasBackLighting: boolean;
  hasMagneticClosure: boolean;
  ventilationHoles: number;
}

export interface GablotaCalculationResult {
  mainComponents: {
    surface: number;
    weight: number;
    cost: number;
  };
  baseComponent?: {
    surface: number;
    weight: number;
    cost: number;
  };
  totalCost: number;
  totalWeight: number;
  totalSurface: number;
}