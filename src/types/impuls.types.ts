// types/impuls.types.ts

import { MaterialSpec } from './calculator.types';

export interface ImpulsKasowyOptions {
  // Materiał
  plexiType: 'clear' | 'white';
  thickness: number; // 1-20 mm
  
  // Konstrukcja
  shelvesCount: number; // min. 2
  limiterHeight: number; // domyślnie 60 mm
  
  // Grafika
  graphics: {
    enabled: boolean;
    type: 'none' | 'single' | 'double';
    coverage: 'back-only' | 'full'; // tylko plecy lub cała konstrukcja
  };
  
  // Opcje dodatkowe
  features: {
    reinforcedShelves: boolean; // wzmocnione półki
    roundedCorners: boolean; // zaokrąglone rogi
    antiSlipStrips: boolean; // paski antypoślizgowe na półkach
    customLimiterHeight: boolean; // niestandardowa wysokość ogranicznika
  };
}

export interface ImpulsCalculationResult {
  components: Array<{
    name: string;
    type: 'wall' | 'shelf' | 'limiter';
    surface: number;
    bendingLength?: number; // dla ograniczników
  }>;
  materialCost: number;
  graphicsCost: number;
  bendingCost: number;
  totalCost: number;
  shelvesDimensions: {
    shelfDepth: number;
    limiterHeight: number;
    totalDepthWithLimiter: number;
  };
}