// Hook for calculator logic
// hooks/useCalculatorLogic.ts

import { useState, useCallback, useMemo } from 'react';
import { 
  ProductType, 
  Dimensions, 
  MaterialSpec, 
  CalculationResult,
  ContainerOptions,
  CabinetOptions,
  EnclosureOptions,
  ImpulsOptions,
  ComponentCalculation,
  GablotaOptions,
  EkspozytorOptions
} from '../types';
// Tymczasowe funkcje placeholder - zastąp właściwymi implementacjami
const calculateContainerSurface = (dimensions: any, options: any) => {
  return [];
};

const calculateEnclosureSurface = (dimensions: any, options: any) => {
  return [];
};

const calculateImpulsSurface = (dimensions: any, options: any) => {
  return [];
};

const calculateCabinetSurface = (dimensions: any, options: any) => {
  return [];
};
import { 
  calculateTotalWeight,
  calculateMixedMaterialsWeight
} from '../utils/weightCalculations';
import { calculateTotalEdgeLength } from '../utils/edgeCalculations';
import { 
  PROFIT_MULTIPLIERS,
  WASTE_PERCENTAGES,
  ADDON_PRICES
} from '../constants/pricing';
import { calculateGablota, calculateGablotaAddons } from '../calculators/calculateGablota';
import { calculateExpVariant } from '../calculators/calculateExpVariant';

interface CalculatorState {
  productType: ProductType;
  material: MaterialSpec | null;
  thickness: number;
  dimensions: Dimensions;
  quantity: number;
  
  // Opcje produktów
  containerOptions?: ContainerOptions;
  cabinetOptions?: CabinetOptions;
  enclosureOptions?: EnclosureOptions;
  impulsOptions?: ImpulsOptions;
  gablotaOptions?: GablotaOptions;
  ekspozytorOptions?: EkspozytorOptions;
  
  // Dodatki
  addons: {
    drilling?: { enabled: boolean; holesCount: number };
    edgePolishing?: { enabled: boolean; customLength?: number };
    bending?: { enabled: boolean; length: number };
    graphics?: { enabled: boolean; type: 'single' | 'double'; surface?: number };
  };
}

interface AddonCalculation {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  appliesToMultiplier: boolean;
}

interface LogisticsCalculation {
  packaging: {
    type: string;
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

interface CalculationSummary {
  productCost: number;
  logisticsCost: number;
  totalNetto: number;
  vat: number;
  totalBrutto: number;
}

interface FullCalculationResult {
  components: ComponentCalculation[];
  totalMaterial: {
    surface: number;
    weight: number;
    cost: number;
    wastePercentage: number;
  };
  addons: AddonCalculation[];
  logistics: LogisticsCalculation;
  summary: CalculationSummary;
}

export function useCalculatorLogic() {
  const [state, setState] = useState<CalculatorState>({
    productType: 'formatka',
    material: null,
    thickness: 3,
    dimensions: { width: 1000, height: 500, depth: 0 },
    quantity: 1,
    addons: {}
  });

  /**
   * Oblicza komponenty produktu
   */
  const calculateComponents = useCallback((): ComponentCalculation[] => {
    const { productType, dimensions } = state;
    
    switch (productType) {
      case 'pojemnik':
        return calculateContainerSurface(dimensions, state.containerOptions!);
        
      case 'gablota':
        if (state.gablotaOptions) {
          const gablotaResult = calculateGablota(
            dimensions,
            state.gablotaOptions,
            state.quantity
          );
          return gablotaResult.components;
        }
        return calculateCabinetSurface(dimensions, state.cabinetOptions!);
        
      case 'obudowa':
        return calculateEnclosureSurface(dimensions, state.enclosureOptions!);
        
      case 'impuls_kasowy':
        return calculateImpulsSurface(dimensions, state.impulsOptions!);
        
      case 'ekspozytory':
        if (state.ekspozytorOptions) {
          const expResult = calculateExpVariant(dimensions, state.ekspozytorOptions);
          return expResult.components;
        }
        return [];
        
      case 'plyta':
      default:
        // Pojedyncza płyta
        return [{
          name: 'Płyta',
          type: 'wall',
          dimensions: { ...dimensions, depth: 0 },
          surface: (dimensions.width * dimensions.height) / 1e6,
          weight: 0,
          edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
          materialCost: 0
        }];
    }
  }, [state]);

  /**
   * Oblicza koszty materiału
   */
  const calculateMaterialCosts = useCallback((components: ComponentCalculation[]): number => {
    const { material, thickness, productType, quantity } = state;
    if (!material) return 0;
    
    // Suma powierzchni wszystkich komponentów
    const totalSurface = components.reduce((sum, comp) => sum + comp.surface, 0);
    
    // Uwzględnij odpady
    const wastePercentage = WASTE_PERCENTAGES[productType] || WASTE_PERCENTAGES.default;
    const surfaceWithWaste = totalSurface * (1 + wastePercentage);
    
    // Koszt podstawowy
    let baseCost = surfaceWithWaste * material.pricePerM2 * thickness * quantity;
    
    // Mnożnik zysku (tylko dla materiału głównego!)
    const multiplier = getProductMultiplier(productType, state);
    baseCost *= multiplier;
    
    // Aktualizuj koszty w komponentach
    components.forEach(comp => {
      comp.materialCost = comp.surface * material.pricePerM2 * thickness * multiplier * quantity;
    });
    
    return baseCost;
  }, [state]);

  /**
   * Oblicza koszty dodatków
   */
  const calculateAddonsCosts = useCallback((): AddonCalculation[] => {
    const { addons, thickness, quantity, dimensions, productType } = state;
    const addonsList: AddonCalculation[] = [];
    const components = calculateComponents();

    // Dodatki specyficzne dla produktu
    if (productType === 'gablota' && state.gablotaOptions) {
      const gablotaAddons = calculateGablotaAddons(
        state.gablotaOptions,
        dimensions,
        quantity
      );
      gablotaAddons.forEach(addon => {
        addonsList.push({
          name: addon.name,
          quantity: addon.quantity,
          unit: addon.name.includes('LED') ? 'm' : 'szt',
          unitPrice: addon.unitPrice,
          totalPrice: addon.totalPrice,
          appliesToMultiplier: false
        });
      });
    }

    if (productType === 'ekspozytory' && state.ekspozytorOptions) {
      const expResult = calculateExpVariant(dimensions, state.ekspozytorOptions);
      expResult.additionalElements.forEach(element => {
        addonsList.push({
          name: element.name,
          quantity: element.quantity,
          unit: 'szt',
          unitPrice: element.unitCost,
          totalPrice: element.totalCost,
          appliesToMultiplier: false
        });
      });
    }
    
    // Wiercenie otworów
    if (addons.drilling?.enabled && addons.drilling.holesCount > 0) {
      addonsList.push({
        name: 'Wiercenie otworów',
        quantity: addons.drilling.holesCount * quantity,
        unit: 'szt',
        unitPrice: ADDON_PRICES.wiercenie,
        totalPrice: addons.drilling.holesCount * quantity * ADDON_PRICES.wiercenie,
        appliesToMultiplier: false
      });
    }
    
    // Polerowanie krawędzi
    if (addons.edgePolishing?.enabled) {
      const edgeLength = addons.edgePolishing.customLength || 
                        calculateTotalEdgeLength(components, productType, state);
      const totalLength = edgeLength * quantity;
      const cost = Math.max(totalLength * ADDON_PRICES.polerowanie, 9); // Min 9 zł
      
      addonsList.push({
        name: 'Polerowanie krawędzi',
        quantity: totalLength,
        unit: 'mb',
        unitPrice: ADDON_PRICES.polerowanie,
        totalPrice: cost,
        appliesToMultiplier: false
      });
    }
    
    // Gięcie na gorąco
    if (addons.bending?.enabled && addons.bending.length > 0) {
      const bendingPrice = ADDON_PRICES.giecieNaGoraco[thickness as keyof typeof ADDON_PRICES.giecieNaGoraco] || 0;
      
      addonsList.push({
        name: 'Gięcie na gorąco',
        quantity: addons.bending.length,
        unit: 'mb',
        unitPrice: bendingPrice,
        totalPrice: addons.bending.length * bendingPrice,
        appliesToMultiplier: false
      });
    }
    
    // Grafika
    if (addons.graphics?.enabled) {
      const graphicsSurface = addons.graphics.surface || 
                             components.reduce((sum, c) => sum + c.surface, 0);
      const price = addons.graphics.type === 'double' ? 150 : 75;
      
      addonsList.push({
        name: `Grafika ${addons.graphics.type === 'double' ? 'dwustronna' : 'jednostronna'}`,
        quantity: graphicsSurface * quantity,
        unit: 'm²',
        unitPrice: price,
        totalPrice: graphicsSurface * quantity * price,
        appliesToMultiplier: false
      });
    }
    
    return addonsList;
  }, [state, calculateComponents]);

  /**
   * Główna funkcja kalkulacyjna
   */
  const calculate = useCallback((): FullCalculationResult => {
    const components = calculateComponents();
    
    // Oblicz wagę
    if (state.material) {
      calculateTotalWeight(components, state.material, state.thickness);
    }
    
    // Koszty materiału
    const materialCost = calculateMaterialCosts(components);
    
    // Koszty dodatków
    const addons = calculateAddonsCosts();
    const addonsCost = addons.reduce((sum, addon) => sum + addon.totalPrice, 0);
    
    // Logistyka (uproszczona)
    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0) * state.quantity;
    const logistics: LogisticsCalculation = {
      packaging: {
        type: 'unit_box',
        count: state.quantity,
        cost: 35 * state.quantity
      },
      delivery: {
        type: 'courier',
        cost: totalWeight <= 20 ? 25 : totalWeight <= 60 ? 40 : 200
      },
      totalWeight,
      totalVolume: 0 // Do implementacji
    };
    
    // Podsumowanie
    const productCost = materialCost + addonsCost;
    const logisticsCost = logistics.packaging.cost + logistics.delivery.cost;
    const totalNetto = productCost + logisticsCost;
    const vat = totalNetto * 0.23;
    const totalBrutto = totalNetto + vat;
    
    return {
      components,
      totalMaterial: {
        surface: components.reduce((sum, c) => sum + c.surface, 0),
        weight: totalWeight,
        cost: materialCost,
        wastePercentage: WASTE_PERCENTAGES[state.productType] || 0
      },
      addons,
      logistics,
      summary: {
        productCost,
        logisticsCost,
        totalNetto,
        vat,
        totalBrutto
      }
    };
  }, [state, calculateComponents, calculateMaterialCosts, calculateAddonsCosts]);

  /**
   * Pomocnicza funkcja do pobierania mnożnika
   */
  function getProductMultiplier(productType: ProductType, state: CalculatorState): number {
    const multipliers = PROFIT_MULTIPLIERS[productType];
    
    if (typeof multipliers === 'object' && productType === 'ekspozytory') {
      // Dla ekspozytorów
      const ekspozytorType = state.ekspozytorOptions?.subtype || 'podstawkowy';
      return multipliers[ekspozytorType] || 1;
    }
    
    return typeof multipliers === 'number' ? multipliers : 1;
  }

  /**
   * Aktualizacja stanu
   */
  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Aktualizacja wymiarów
   */
  const updateDimensions = useCallback((dim: Partial<Dimensions>) => {
    setState(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, ...dim }
    }));
  }, []);

  /**
   * Aktualizacja opcji pojemnika
   */
  const updateContainerOptions = useCallback((options: Partial<ContainerOptions>) => {
    setState(prev => ({
      ...prev,
      containerOptions: { ...prev.containerOptions!, ...options }
    }));
  }, []);

  /**
   * Aktualizacja opcji obudowy
   */
  const updateEnclosureWalls = useCallback((walls: Partial<EnclosureOptions['walls']>) => {
    setState(prev => ({
      ...prev,
      enclosureOptions: {
        ...prev.enclosureOptions!,
        walls: { ...prev.enclosureOptions!.walls, ...walls }
      }
    }));
  }, []);

  // Wyniki (memoizowane)
  const results = useMemo(() => calculate(), [calculate]);

  return {
    state,
    results,
    updateState,
    updateDimensions,
    updateContainerOptions,
    updateEnclosureWalls,
    // Dodaj więcej metod aktualizacji według potrzeb
  };
}