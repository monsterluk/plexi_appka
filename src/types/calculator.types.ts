// Calculator types for plexi_appka

export interface CalculatorState {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  product: string;
}

export interface CalculationResult {
  surface: number;
  weight: number;
  price: number;
}
