// src/types/calculator.types.ts
export interface CalculationResult {
    surface: number;
    weight: number;
    materialCost: number;
    addonsCost?: number;
    totalCost: number;
    breakdown?: {
      [key: string]: number;
    };
  }
  
  export interface CalculatorState {
    formatka?: CalculationResult;
    kaseton?: CalculationResult;
    ledon?: CalculationResult;
    currentProduct: string | null;
  }