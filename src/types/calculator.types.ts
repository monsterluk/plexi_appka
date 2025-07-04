// Calculator types for plexi_appka

// types/calculator.types.ts

export interface Dimensions {
    width: number;  // mm
    height: number; // mm
    depth: number;  // mm
  }
  
  export interface MaterialSpec {
    id: number;
    name: string;
    pricePerM2: number; // cena za m² dla 1mm grubości
    density: number;    // kg/m³
    availableThicknesses: number[];
  }
  
  export interface CalculationResult {
    components: ComponentCalculation[];
    totalMaterial: {
      surface: number;
      weight: number;
      cost: number;
      wastePercentage: number;
    };
    addons: AddonCalculation[];
    logistics: LogisticsCalculation;
    summary: {
      productCost: number;
      logisticsCost: number;
      totalNetto: number;
      vat: number;
      totalBrutto: number;
    };
  }
  
  export interface ComponentCalculation {
    name: string;
    type: 'wall' | 'partition' | 'shelf' | 'base' | 'lid';
    dimensions: Dimensions;
    surface: number;
    weight: number;
    edgeLength: number;
    materialCost: number;
  }
  
  export interface AddonCalculation {
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    appliesToMultiplier: boolean;
  }
  
  export interface LogisticsCalculation {
    packaging: {
      type: 'unit_box' | 'collective_box' | 'pallet';
      count: number;
      cost: number;
    };
    delivery: {
      type: string;
      cost: number;
    };
    totalWeight: number;
    totalVolume: number;
  }

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