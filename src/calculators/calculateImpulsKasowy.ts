// calculators/calculateImpulsKasowy.ts

import { ImpulsKasowyOptions, ImpulsCalculationResult } from '../types/impuls.types';
import { ComponentCalculation } from '../types/calculator.types';
import { BENDING_PRICES } from '../constants/pricing';

const IMPULS_MULTIPLIER = 1.8;
const WASTE_PERCENTAGE = 0.05; // 5% odpadu
const DEFAULT_LIMITER_HEIGHT = 60; // mm

export function calculateImpulsKasowy(
  dimensions: { width: number; height: number; depth: number },
  options: ImpulsKasowyOptions,
  quantity: number
): ImpulsCalculationResult & { 
  components: ComponentCalculation[];
  totalSurface: number;
  totalWeight: number;
} {
  const components: ComponentCalculation[] = [];
  const { width, height, depth } = dimensions;
  const limiterHeight = options.features.customLimiterHeight 
    ? options.limiterHeight 
    : DEFAULT_LIMITER_HEIGHT;

  // Cena materiału bazowego
  const materialPricePerM2 = options.plexiType === 'white' ? 35 : 30;

  // 1. PLECY
  components.push({
    name: 'Plecy',
    type: 'wall',
    dimensions: { width, height, depth: 0 },
    surface: (width * height) / 1e6,
    weight: 0,
    edgeLength: 2 * (width + height) / 1000,
    materialCost: 0
  });

  // 2. BOKI (2 sztuki)
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

  // 3. PÓŁKI Z OGRANICZNIKAMI
  let totalBendingLength = 0;
  
  for (let i = 0; i < options.shelvesCount; i++) {
    // Półka
    components.push({
      name: `Półka ${i + 1}`,
      type: 'shelf',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });

    // Ogranicznik (zagięty front półki)
    components.push({
      name: `Ogranicznik półki ${i + 1}`,
      type: 'limiter',
      dimensions: { width, height: limiterHeight, depth: 0 },
      surface: (width * limiterHeight) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + limiterHeight) / 1000,
      materialCost: 0
    });

    // Długość gięcia dla ogranicznika
    totalBendingLength += width / 1000; // konwersja na metry
  }

  // 4. OBLICZENIA POWIERZCHNI I KOSZTÓW
  const totalSurface = components.reduce((sum, c) => sum + c.surface, 0);
  const surfaceWithWaste = totalSurface * (1 + WASTE_PERCENTAGE);

  // Koszt materiału z mnożnikiem
  const materialCost = surfaceWithWaste * materialPricePerM2 * options.thickness * 
                      IMPULS_MULTIPLIER * quantity;

  // Koszt gięcia na gorąco
  const bendingPricePerMeter = BENDING_PRICES[options.thickness] || 5;
  const bendingCost = totalBendingLength * bendingPricePerMeter * quantity;

  // 5. GRAFIKA (bez mnożnika)
  let graphicsCost = 0;
  let graphicsSurface = 0;

  if (options.graphics.enabled && options.graphics.type !== 'none') {
    // Powierzchnia do pokrycia grafiką
    if (options.graphics.coverage === 'back-only') {
      // Tylko plecy
      graphicsSurface = (width * height) / 1e6;
    } else {
      // Plecy + boki
      graphicsSurface = ((width * height) + 2 * (depth * height)) / 1e6;
    }

    const graphicsPrice = options.graphics.type === 'double' ? 150 : 75;
    graphicsCost = graphicsSurface * graphicsPrice * quantity;
  }

  // 6. KOSZTY DODATKÓW
  const additionalCosts: Array<{
    name: string;
    cost: number;
  }> = [];

  if (options.features.reinforcedShelves) {
    // Dodatkowa grubość półek (+50% kosztu półek)
    const shelvesCost = components
      .filter(c => c.type === 'shelf')
      .reduce((sum, c) => sum + c.surface, 0) * 
      materialPricePerM2 * options.thickness * 0.5 * quantity;
    
    additionalCosts.push({
      name: 'Wzmocnienie półek',
      cost: shelvesCost
    });
  }

  if (options.features.roundedCorners) {
    additionalCosts.push({
      name: 'Zaokrąglanie rogów',
      cost: 25 * quantity // stała cena za sztukę
    });
  }

  if (options.features.antiSlipStrips) {
    additionalCosts.push({
      name: 'Paski antypoślizgowe',
      cost: options.shelvesCount * 5 * quantity // 5 zł za półkę
    });
  }

  const totalAdditionalCosts = additionalCosts.reduce((sum, item) => sum + item.cost, 0);

  // 7. WAGA (przyjmując gęstość plexi 1190 kg/m³)
  const plexiDensity = 1190; // kg/m³
  const totalWeight = totalSurface * (options.thickness / 1000) * plexiDensity * quantity;

  // 8. PODSUMOWANIE
  const totalCost = materialCost + bendingCost + graphicsCost + totalAdditionalCosts;

  return {
    components: components.map(c => ({
      name: c.name,
      type: c.type as 'wall' | 'shelf' | 'limiter',
      surface: c.surface,
      bendingLength: c.type === 'limiter' ? width / 1000 : undefined
    })),
    materialCost,
    graphicsCost,
    bendingCost,
    totalCost,
    shelvesDimensions: {
      shelfDepth: depth,
      limiterHeight: limiterHeight,
      totalDepthWithLimiter: depth + limiterHeight
    },
    // Dodatkowe pola dla integracji
    components: components,
    totalSurface: totalSurface * quantity,
    totalWeight
  };
}

// Funkcja pomocnicza do generowania listy dodatków dla systemu
export function getImpulsAddons(
  options: ImpulsKasowyOptions,
  dimensions: { width: number; height: number; depth: number },
  quantity: number
): Array<{
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  appliesToMultiplier: boolean;
}> {
  const addons = [];

  // Gięcie na gorąco
  const bendingLength = (dimensions.width * options.shelvesCount) / 1000;
  const bendingPrice = BENDING_PRICES[options.thickness] || 5;
  
  addons.push({
    name: 'Gięcie na gorąco ograniczników',
    quantity: bendingLength * quantity,
    unit: 'mb',
    unitPrice: bendingPrice,
    totalPrice: bendingLength * bendingPrice * quantity,
    appliesToMultiplier: false
  });

  // Grafika
  if (options.graphics.enabled && options.graphics.type !== 'none') {
    let graphicsSurface = 0;
    
    if (options.graphics.coverage === 'back-only') {
      graphicsSurface = (dimensions.width * dimensions.height) / 1e6;
    } else {
      graphicsSurface = ((dimensions.width * dimensions.height) + 
                        2 * (dimensions.depth * dimensions.height)) / 1e6;
    }

    addons.push({
      name: `Grafika ${options.graphics.type === 'double' ? 'dwustronna' : 'jednostronna'}`,
      quantity: graphicsSurface * quantity,
      unit: 'm²',
      unitPrice: options.graphics.type === 'double' ? 150 : 75,
      totalPrice: graphicsSurface * (options.graphics.type === 'double' ? 150 : 75) * quantity,
      appliesToMultiplier: false
    });
  }

  // Wzmocnione półki
  if (options.features.reinforcedShelves) {
    addons.push({
      name: 'Wzmocnienie półek',
      quantity: options.shelvesCount * quantity,
      unit: 'szt',
      unitPrice: 15,
      totalPrice: options.shelvesCount * 15 * quantity,
      appliesToMultiplier: false
    });
  }

  // Zaokrąglone rogi
  if (options.features.roundedCorners) {
    addons.push({
      name: 'Zaokrąglanie rogów',
      quantity: quantity,
      unit: 'szt',
      unitPrice: 25,
      totalPrice: 25 * quantity,
      appliesToMultiplier: false
    });
  }

  // Paski antypoślizgowe
  if (options.features.antiSlipStrips) {
    addons.push({
      name: 'Paski antypoślizgowe',
      quantity: options.shelvesCount * quantity,
      unit: 'kpl',
      unitPrice: 5,
      totalPrice: options.shelvesCount * 5 * quantity,
      appliesToMultiplier: false
    });
  }

  // Elementy montażowe
  addons.push({
    name: 'Kątowniki montażowe',
    quantity: (4 + options.shelvesCount * 2) * quantity,
    unit: 'szt',
    unitPrice: 1.5,
    totalPrice: (4 + options.shelvesCount * 2) * 1.5 * quantity,
    appliesToMultiplier: false
  });

  return addons;
}