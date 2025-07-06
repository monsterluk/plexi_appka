// calculators/calculateObudowa.ts

import {
    ObudowaOptions,
    ObudowaValidation,
    WallConfig
  } from '../types/obudowa.types';
  import { ComponentCalculation } from '../types/calculator.types';
  import { calculateComponentWeight } from '../utils/weightCalculations';
  
  const OBUDOWA_MULTIPLIER = 1.8;
  const WASTE_PERCENTAGE = 0.08; // 8% odpadu
  
  export function calculateObudowa(
    dimensions: { width: number; height: number; depth: number },
    options: ObudowaOptions,
    quantity: number
  ): {
    components: ComponentCalculation[];
    validation: ObudowaValidation;
    totalCost: number;
    totalWeight: number;
    totalSurface: number;
    additionalCosts: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  } {
    const components: ComponentCalculation[] = [];
    const additionalCosts: any[] = [];
    const { width, height, depth } = dimensions;
  
    // Walidacja
    const validation = validateObudowaConfig(options);
    
    // Oblicz komponenty dla każdej włączonej ściany
    const wallDimensions = {
      front: { width, height, name: 'Przód' },
      back: { width, height, name: 'Tył' },
      left: { width: depth, height, name: 'Lewa ściana' },
      right: { width: depth, height, name: 'Prawa ściana' },
      top: { width, height: depth, name: 'Góra' },
      bottom: { width, height: depth, name: 'Dół' }
    };
  
    // Dodaj komponenty dla włączonych ścian
    Object.entries(options.walls).forEach(([wall, config]) => {
      if (config.enabled) {
        const wallDim = wallDimensions[wall as keyof typeof wallDimensions];
        const material = config.material || options.defaultMaterial;
        const thickness = config.thickness || options.defaultThickness;
        
        components.push({
          name: wallDim.name,
          type: 'wall',
          dimensions: {
            width: wallDim.width,
            height: wallDim.height,
            depth: 0
          },
          surface: (wallDim.width * wallDim.height) / 1e6,
          weight: 0, // Obliczone później
          edgeLength: 2 * (wallDim.width + wallDim.height) / 1000,
          materialCost: 0
        });
  
        // Otwory wentylacyjne
        if (config.hasVentilation) {
          additionalCosts.push({
            name: `Otwory wentylacyjne - ${wallDim.name}`,
            quantity: 20 * quantity, // 20 otworów na ścianę
            unitPrice: 0.5,
            totalPrice: 20 * 0.5 * quantity
          });
        }
  
        // Przepusty kablowe
        if (config.hasCableHoles) {
          additionalCosts.push({
            name: `Przepusty kablowe - ${wallDim.name}`,
            quantity: 4 * quantity, // 4 otwory na ścianę
            unitPrice: 2,
            totalPrice: 4 * 2 * quantity
          });
        }
      }
    });
  
    // Oblicz wagę komponentów
    components.forEach(component => {
      component.weight = calculateComponentWeight(
        component,
        options.defaultMaterial,
        options.defaultThickness
      );
    });
  
    // Funkcje dodatkowe
    if (options.features.hasDoor) {
      additionalCosts.push({
        name: 'Zawiasy i zamek do drzwiczek',
        quantity: 1 * quantity,
        unitPrice: 45,
        totalPrice: 45 * quantity
      });
  
      // Wycięcie otworu na drzwiczki
      additionalCosts.push({
        name: 'Wycięcie otworu na drzwiczki',
        quantity: 1 * quantity,
        unitPrice: 30,
        totalPrice: 30 * quantity
      });
    }
  
    if (options.features.hasWindow) {
      const windowArea = (options.features.windowSize?.width || 200) *
                        (options.features.windowSize?.height || 150) / 1e6;
      
      additionalCosts.push({
        name: 'Okno inspekcyjne z plexi',
        quantity: windowArea * quantity,
        unitPrice: 150, // zł/m²
        totalPrice: windowArea * 150 * quantity
      });
  
      additionalCosts.push({
        name: 'Wycięcie otworu na okno',
        quantity: 1 * quantity,
        unitPrice: 25,
        totalPrice: 25 * quantity
      });
    }
  
    if (options.features.hasHandle) {
      additionalCosts.push({
        name: 'Uchwyt transportowy',
        quantity: 1 * quantity,
        unitPrice: 15,
        totalPrice: 15 * quantity
      });
    }
  
    if (options.features.hasCoolingFan) {
      const fanCount = options.features.fanCount || 1;
      additionalCosts.push({
        name: 'Wentylator 120mm z kratką',
        quantity: fanCount * quantity,
        unitPrice: 35,
        totalPrice: fanCount * 35 * quantity
      });
  
      additionalCosts.push({
        name: 'Wycięcie otworu na wentylator',
        quantity: fanCount * quantity,
        unitPrice: 15,
        totalPrice: fanCount * 15 * quantity
      });
    }
  
    // Opcje montażowe
    if (options.mounting.hasRails) {
      additionalCosts.push({
        name: 'Szyny montażowe DIN',
        quantity: 2 * quantity,
        unitPrice: 25,
        totalPrice: 2 * 25 * quantity
      });
    }
  
    if (options.mounting.hasBrackets) {
      additionalCosts.push({
        name: 'Wsporniki montażowe',
        quantity: 4 * quantity,
        unitPrice: 8,
        totalPrice: 4 * 8 * quantity
      });
    }
  
    // Elementy montażowe w zależności od typu
    switch (options.mounting.type) {
      case 'wall':
        additionalCosts.push({
          name: 'Kątowniki do montażu ściennego',
          quantity: 4 * quantity,
          unitPrice: 5,
          totalPrice: 4 * 5 * quantity
        });
        break;
      case 'ceiling':
        additionalCosts.push({
          name: 'Uchwyty sufitowe',
          quantity: 4 * quantity,
          unitPrice: 12,
          totalPrice: 4 * 12 * quantity
        });
        break;
      case 'floor':
        additionalCosts.push({
          name: 'Stopki antypoślizgowe',
          quantity: 4 * quantity,
          unitPrice: 3,
          totalPrice: 4 * 3 * quantity
        });
        break;
    }
  
    // Obliczenia końcowe
    const totalSurface = components.reduce((sum, c) => sum + c.surface, 0) * quantity;
    const totalWeight = components.reduce((sum, c) => sum + (c.weight || 0), 0) * quantity;
    
    // Koszt materiału z odpadem i mnożnikiem
    const materialCost = totalSurface * 
                        options.defaultMaterial.pricePerM2 * 
                        options.defaultThickness *
                        (1 + WASTE_PERCENTAGE) * 
                        OBUDOWA_MULTIPLIER;
    
    // Koszt dodatków (bez mnożnika)
    const addonsCost = additionalCosts.reduce((sum, addon) => sum + addon.totalPrice, 0);
    
    const totalCost = materialCost + addonsCost;
  
    return {
      components,
      validation,
      totalCost,
      totalWeight,
      totalSurface,
      additionalCosts
    };
  }
  
  // Funkcja walidacji
  function validateObudowaConfig(options: ObudowaOptions): ObudowaValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const enabledWalls = Object.entries(options.walls)
      .filter(([_, config]) => config.enabled)
      .map(([wall, _]) => wall);
    
    const wallCount = enabledWalls.length;
    
    // Błędy
    if (wallCount < 3) {
      errors.push('Obudowa musi mieć minimum 3 ściany');
    }
    
    // Ostrzeżenia
    if (!options.walls.back.enabled) {
      warnings.push('Brak tylnej ściany może ograniczyć stabilność konstrukcji');
    }
    
    if (!options.walls.bottom.enabled && options.mounting.type === 'floor') {
      warnings.push('Montaż podłogowy bez dolnej ściany wymaga dodatkowej ramy');
    }
    
    if (wallCount === 6 && !hasAnyVentilation(options)) {
      warnings.push('Pełna obudowa bez wentylacji może powodować przegrzewanie');
    }
    
    if (options.features.hasDoor && !options.walls[options.features.doorSide || 'front'].enabled) {
      errors.push(`Drzwiczki nie mogą być zamontowane na nieistniejącej ścianie`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      wallCount
    };
  }
  
  // Sprawdź czy jest jakakolwiek wentylacja
  function hasAnyVentilation(options: ObudowaOptions): boolean {
    const hasVentHoles = Object.values(options.walls).some(wall => wall.hasVentilation);
    return hasVentHoles || options.features.hasCoolingFan;
  }
  
  // Oblicz powierzchnię cięcia (dla wyceny dodatkowej)
  export function calculateCuttingSurface(options: ObudowaOptions): number {
    let cuttingSurface = 0;
    
    // Okno inspekcyjne
    if (options.features.hasWindow) {
      const windowArea = (options.features.windowSize?.width || 200) *
                        (options.features.windowSize?.height || 150) / 1e6;
      cuttingSurface += windowArea;
    }
    
    // Drzwiczki (zakładamy 70% powierzchni ściany)
    if (options.features.hasDoor) {
      cuttingSurface += 0.7; // m²
    }
    
    return cuttingSurface;
  }