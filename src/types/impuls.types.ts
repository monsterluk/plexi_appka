export interface ImpulsKasowyOptions {
  plexiType: 'clear' | 'white';
  thickness: 3 | 4 | 5;
  shelvesCount: number;
  limiterHeight: number;
  graphics: {
    enabled: boolean;
    type: 'single' | 'double' | 'none';
    coverage: 'back-only' | 'back-and-sides';
  };
  features: {
    reinforcedShelves: boolean;
    roundedCorners: boolean;
    antiSlipStrips: boolean;
    customLimiterHeight: boolean;
  };
}

export interface ImpulsComponent {
  name: string;
  type: 'wall' | 'shelf' | 'limiter';
  surface: number;
  bendingLength?: number;
}

export interface ImpulsCalculationResult {
  components: ImpulsComponent[];
  materialCost: number;
  graphicsCost: number;
  bendingCost: number;
  totalCost: number;
  shelvesDimensions: {
    shelfDepth: number;
    limiterHeight: number;
    totalDepthWithLimiter: number;
  };
  totalSurface: number;
  totalWeight: number;
}