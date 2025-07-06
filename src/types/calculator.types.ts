export interface ComponentCalculation {
  name: string;
  type: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  surface: number;
  weight: number;
  edgeLength: number;
  materialCost: number;
}

export interface CalculationResult {
  components: ComponentCalculation[];
  materialCost: number;
  graphicsCost?: number;
  bendingCost?: number;
  totalCost: number;
  weight?: number;
  surface?: number;
  additionalCosts?: Array<{
    name: string;
    cost: number;
  }>;
}

export interface MaterialSpec {
  id: number;
  nazwa: string;
  cena_za_m2: number;
  pricePerM2: number;
  density: number;
  thickness?: number;
  type?: string;
}

export interface PricingOptions {
  quantity: number;
  material: MaterialSpec;
  thickness: number;
  additionalFeatures?: string[];
}

export interface AddonItem {
  name: string;
  price: number;
  unit?: string;
  quantity?: number;
}