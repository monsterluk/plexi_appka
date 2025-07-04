// calculators/calculateGablota.ts

import { 
    GablotaOptions, 
    GablotaCalculationResult 
  } from '../types/gablota.types';
  import { ComponentCalculation } from '../types/calculator.types';
  import { calculateComponentWeight } from '../utils/weightCalculations';
  
  const GABLOTA_MULTIPLIER = 1.85;
  
  export function calculateGablota(
    dimensions: { width: number; height: number; depth: number },
    options: GablotaOptions,
    quantity: number
  ): GablotaCalculationResult & { components: ComponentCalculation[] } {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
  
    // 1. Ściany główne (5 sztuk - bez frontu)
    
    // Tył
    components.push({
      name: 'Tył',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
  
    // Lewy bok
    components.push({
      name: 'Lewy bok',
      type: 'wall',
      dimensions: { width: depth, height, depth: 0 },
      surface: (depth * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (depth + height) / 1000,
      materialCost: 0
    });
  
    // Prawy bok
    components.push({
      name: 'Prawy bok',
      type: 'wall',
      dimensions: { width: depth, height, depth: 0 },
      surface: (depth * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (depth + height) / 1000,
      materialCost: 0
    });
  
    // Góra
    components.push({
      name: 'Góra',
      type: 'wall',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
  
    // Dół (brak w standardowej gablocie)
    // Będzie dodane osobno jeśli włączona opcja
  
    // 2. Przegrody
    if (options.partitions.enabled) {
      // Przegrody poziome (półki)
      for (let i = 0; i < options.partitions.horizontal; i++) {
        components.push({
          name: `Półka ${i + 1}`,
          type: 'shelf',
          dimensions: { width, height: depth, depth: 0 },
          surface: (width * depth) / 1e6,
          weight: 0,
          edgeLength: 2 * (width + depth) / 1000,
          materialCost: 0
        });
      }
  
      // Przegrody pionowe
      for (let i = 0; i < options.partitions.vertical; i++) {
        components.push({
          name: `Przegroda pionowa ${i + 1}`,
          type: 'partition',
          dimensions: { width: depth, height, depth: 0 },
          surface: (depth * height) / 1e6,
          weight: 0,
          edgeLength: 2 * (depth + height) / 1000,
          materialCost: 0
        });
      }
    }
  
    // 3. Oblicz wagę komponentów głównych
    components.forEach(component => {
      component.weight = calculateComponentWeight(
        component,
        options.material,
        options.thickness
      );
    });
  
    // 4. Oblicz koszty główne
    const mainSurface = components.reduce((sum, c) => sum + c.surface, 0);
    const mainWeight = components.reduce((sum, c) => sum + c.weight, 0);
    
    // Koszt z odpadem (8%) i mnożnikiem
    const mainCost = mainSurface * options.material.pricePerM2 * 
                     options.thickness * 1.08 * GABLOTA_MULTIPLIER * quantity;
  
    // 5. Oblicz podstawę (jeśli włączona)
    let baseComponent: GablotaCalculationResult['baseComponent'];
    
    if (options.hasBase && options.baseMaterial && options.baseThickness) {
      const baseSurface = (width * depth) / 1e6;
      const baseWeight = baseSurface * (options.baseThickness / 1000) * 
                        (options.baseMaterial.density || 1200);
      
      // Koszt podstawy BEZ mnożnika, tylko z odpadem
      const baseCost = baseSurface * options.baseMaterial.pricePerM2 * 
                       options.baseThickness * 1.08 * quantity;
  
      baseComponent = {
        surface: baseSurface * quantity,
        weight: baseWeight * quantity,
        cost: baseCost
      };
  
      // Dodaj komponent podstawy do listy
      components.push({
        name: 'Podstawa (dno)',
        type: 'base',
        dimensions: { width, height: depth, depth: 0 },
        surface: baseSurface,
        weight: baseWeight,
        edgeLength: 2 * (width + depth) / 1000,
        materialCost: baseCost / quantity
      });
    }
  
    // 6. Podsumowanie
    const totalSurface = mainSurface * quantity + (baseComponent?.surface || 0);
    const totalWeight = mainWeight * quantity + (baseComponent?.weight || 0);
    const totalCost = mainCost + (baseComponent?.cost || 0);
  
    return {
      components,
      mainComponents: {
        surface: mainSurface * quantity,
        weight: mainWeight * quantity,
        cost: mainCost
      },
      baseComponent,
      totalCost,
      totalWeight,
      totalSurface
    };
  }
  
  // Funkcja do obliczania dodatkowych kosztów
  export function calculateGablotaAddons(
    options: GablotaOptions,
    dimensions: { width: number; height: number; depth: number },
    quantity: number
  ): Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }> {
    const addons = [];
  
    // Podświetlenie LED
    if (options.hasBackLighting) {
      const ledLength = 2 * (dimensions.width + dimensions.depth) / 1000; // metry
      addons.push({
        name: 'Taśma LED z zasilaczem',
        quantity: ledLength * quantity,
        unitPrice: 50, // zł/m
        totalPrice: ledLength * 50 * quantity
      });
    }
  
    // Zamknięcie magnetyczne
    if (options.hasMagneticClosure) {
      addons.push({
        name: 'Magnesy neodymowe',
        quantity: 4 * quantity,
        unitPrice: 3,
        totalPrice: 4 * 3 * quantity
      });
    }
  
    // Otwory wentylacyjne
    if (options.ventilationHoles > 0) {
      addons.push({
        name: 'Wiercenie otworów wentylacyjnych (5mm)',
        quantity: options.ventilationHoles * quantity,
        unitPrice: 0.5,
        totalPrice: options.ventilationHoles * 0.5 * quantity
      });
    }
  
    // Montaż przegród
    if (options.partitions.enabled) {
      const totalPartitions = options.partitions.horizontal + options.partitions.vertical;
      if (totalPartitions > 0) {
        addons.push({
          name: 'Kątowniki montażowe do przegród',
          quantity: totalPartitions * 4 * quantity,
          unitPrice: 1.5,
          totalPrice: totalPartitions * 4 * 1.5 * quantity
        });
      }
    }
  
    return addons;
  }