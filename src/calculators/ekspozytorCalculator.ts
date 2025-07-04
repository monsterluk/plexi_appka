// calculators/ekspozytorCalculator.ts

import { 
    EkspozytorOptions,
    PodstawkowyOptions,
    SchodkowyOptions,
    ZHaczykamiOptions,
    WiszacyOptions,
    StojakOptions,
    KosmetycznyOptions
  } from '../types/ekspozytory.types';
  import { ComponentCalculation } from '../types/calculator.types';
  
  const MULTIPLIERS = {
    podstawkowy: 2.2,
    schodkowy: 2.5,
    z_haczykami: 2.4,
    wiszacy: 2.2,
    stojak: 2.5,
    kosmetyczny: 2.7
  };
  
  const MATERIAL_PRICES = {
    bezbarwna: 30,
    mleczna: 33,
    czarna: 33,
    biala: 33,
    kolorowa_3mm: 120,
    kolorowa_5mm: 200
  };
  
  export function calculateEkspozytor(
    dimensions: { width: number; height: number; depth: number },
    options: EkspozytorOptions
  ): {
    components: ComponentCalculation[];
    materialCost: number;
    additionalCosts: number;
    graphicsCost: number;
    totalCost: number;
    multiplier: number;
  } {
    let components: ComponentCalculation[] = [];
    let additionalCosts = 0;
  
    // Kalkulacja w zależności od typu
    switch (options.subtype) {
      case 'podstawkowy':
        components = calculatePodstawkowy(dimensions, options as PodstawkowyOptions);
        break;
        
      case 'schodkowy':
        components = calculateSchodkowy(dimensions, options as SchodkowyOptions);
        break;
        
      case 'z_haczykami':
        const zHaczykamiOpts = options as ZHaczykamiOptions;
        components = calculateZHaczykami(dimensions, zHaczykamiOpts);
        additionalCosts += zHaczykamiOpts.hooksCount * 2; // 2 zł/haczyk
        break;
        
      case 'wiszacy':
        const wiszacyOpts = options as WiszacyOptions;
        components = calculateWiszacy(dimensions, wiszacyOpts);
        // Koszt montażu
        if (wiszacyOpts.mountingType === 'magnets') {
          additionalCosts += 4 * 4; // 4 magnesy po 4 zł
        } else if (wiszacyOpts.mountingType === 'screws') {
          additionalCosts += 20; // Koszt uchwytów
        }
        break;
        
      case 'stojak':
        components = calculateStojak(dimensions, options as StojakOptions);
        break;
        
      case 'kosmetyczny':
        const kosmetycznyOpts = options as KosmetycznyOptions;
        components = calculateKosmetyczny(dimensions, kosmetycznyOpts);
        // Koszt cięcia otworów
        additionalCosts += kosmetycznyOpts.shelvesWithHoles * 
                          kosmetycznyOpts.holesPerShelf * 5; // 5 zł/otwór
        break;
    }
  
    // Oblicz powierzchnię całkowitą
    const totalSurface = components.reduce((sum, c) => sum + c.surface, 0);
  
    // Oblicz koszt materiału
    const materialPrice = MATERIAL_PRICES[options.material];
    const thickness = options.material.includes('kolorowa') ? 
      parseInt(options.material.split('_')[1]) : options.thickness;
    
    let materialCost = totalSurface * materialPrice * thickness;
    
    // Dodaj 12% odpadu
    materialCost *= 1.12;
    
    // Zastosuj mnożnik
    const multiplier = MULTIPLIERS[options.subtype];
    materialCost *= multiplier;
    
    // Oblicz koszt grafiki (bez mnożnika!)
    let graphicsCost = 0;
    if (options.graphics === 'single') {
      graphicsCost = totalSurface * 75;
    } else if (options.graphics === 'double') {
      graphicsCost = totalSurface * 150;
    }
    
    // Dodatkowa grafika dla topera (kosmetyczny)
    if (options.subtype === 'kosmetyczny') {
      const kosmetycznyOpts = options as KosmetycznyOptions;
      if (kosmetycznyOpts.hasTopper && kosmetycznyOpts.topperHeight) {
        const topperSurface = (dimensions.width * kosmetycznyOpts.topperHeight) / 1e6;
        if (kosmetycznyOpts.topperGraphics === 'single') {
          graphicsCost += topperSurface * 75;
        } else if (kosmetycznyOpts.topperGraphics === 'double') {
          graphicsCost += topperSurface * 150;
        }
      }
    }
    
    // Pomnóż przez ilość
    materialCost *= options.quantity;
    additionalCosts *= options.quantity;
    graphicsCost *= options.quantity;
    
    return {
      components,
      materialCost,
      additionalCosts,
      graphicsCost,
      totalCost: materialCost + additionalCosts + graphicsCost,
      multiplier
    };
  }
  
  // Funkcje pomocnicze dla każdego typu
  
  function calculatePodstawkowy(
    dimensions: { width: number; height: number; depth: number },
    options: PodstawkowyOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
    
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Ścianka tylna
    components.push({
      name: 'Ścianka tylna',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
    
    // Boki (opcjonalne)
    if (options.hasSides) {
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
    }
    
    return components;
  }
  
  function calculateSchodkowy(
    dimensions: { width: number; height: number; depth: number },
    options: SchodkowyOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
    
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Poziomy (półki)
    for (let i = 0; i < options.levels; i++) {
      components.push({
        name: `Poziom ${i + 1}`,
        type: 'shelf',
        dimensions: { width, height: depth, depth: 0 },
        surface: (width * depth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + depth) / 1000,
        materialCost: 0
      });
    }
    
    // Boki (zawsze)
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
    
    // Plecy (opcjonalne)
    if (options.hasBack) {
      components.push({
        name: 'Plecy',
        type: 'wall',
        dimensions: { width, height, depth: 0 },
        surface: (width * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + height) / 1000,
        materialCost: 0
      });
    }
    
    return components;
  }
  
  function calculateZHaczykami(
    dimensions: { width: number; height: number; depth: number },
    options: ZHaczykamiOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
    
    // Płyta tylna
    components.push({
      name: 'Płyta tylna',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
    
    // Podstawa (opcjonalna)
    if (options.hasBase) {
      const baseDepth = options.baseDepth || 200;
      components.push({
        name: 'Podstawa',
        type: 'base',
        dimensions: { width, height: baseDepth, depth: 0 },
        surface: (width * baseDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + baseDepth) / 1000,
        materialCost: 0
      });
    }
    
    // Boki (opcjonalne)
    if (options.hasSides) {
      const sideDepth = options.baseDepth || 200;
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: sideDepth, height, depth: 0 },
        surface: (sideDepth * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (sideDepth + height) / 1000,
        materialCost: 0
      });
      
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: sideDepth, height, depth: 0 },
        surface: (sideDepth * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (sideDepth + height) / 1000,
        materialCost: 0
      });
    }
    
    return components;
  }
  
  function calculateWiszacy(
    dimensions: { width: number; height: number; depth: number },
    options: WiszacyOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height } = dimensions;
    
    // Płyta tylna
    components.push({
      name: 'Płyta tylna',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
    
    // Półki
    for (let i = 0; i < options.shelvesCount; i++) {
      components.push({
        name: `Półka ${i + 1}`,
        type: 'shelf',
        dimensions: { width, height: options.shelfDepth, depth: 0 },
        surface: (width * options.shelfDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + options.shelfDepth) / 1000,
        materialCost: 0
      });
    }
    
    // Boki (opcjonalne)
    if (options.hasSides) {
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: options.shelfDepth, height, depth: 0 },
        surface: (options.shelfDepth * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (options.shelfDepth + height) / 1000,
        materialCost: 0
      });
      
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: options.shelfDepth, height, depth: 0 },
        surface: (options.shelfDepth * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (options.shelfDepth + height) / 1000,
        materialCost: 0
      });
    }
    
    return components;
  }
  
  function calculateStojak(
    dimensions: { width: number; height: number; depth: number },
    options: StojakOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
    
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Plecy
    components.push({
      name: 'Plecy',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
    
    // Boki (opcjonalne)
    if (options.hasSides) {
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
    }
    
    // Półki (opcjonalne)
    for (let i = 0; i < options.shelvesCount; i++) {
      components.push({
        name: `Półka ${i + 1}`,
        type: 'shelf',
        dimensions: { width, height: options.shelfDepth, depth: 0 },
        surface: (width * options.shelfDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + options.shelfDepth) / 1000,
        materialCost: 0
      });
    }
    
    return components;
  }
  
  function calculateKosmetyczny(
    dimensions: { width: number; height: number; depth: number },
    options: KosmetycznyOptions
  ): ComponentCalculation[] {
    const components: ComponentCalculation[] = [];
    const { width, height, depth } = dimensions;
    
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Drugie dno (opcjonalne)
    if (options.hasSecondBottom) {
      components.push({
        name: 'Drugie dno',
        type: 'base',
        dimensions: { width, height: depth, depth: 0 },
        surface: (width * depth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + depth) / 1000,
        materialCost: 0
      });
    }
    
    // Boki (zawsze)
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
    
    // Plecy
    components.push({
      name: 'Plecy',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
    
    // Półki z otworami
    for (let i = 0; i < options.shelvesWithHoles; i++) {
      components.push({
        name: `Półka z otworami ${i + 1}`,
        type: 'shelf',
        dimensions: { width, height: depth, depth: 0 },
        surface: (width * depth) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + depth) / 1000 + 
                    (options.holesPerShelf * 200) / 1000, // Dodatkowe krawędzie otworów
        materialCost: 0
      });
    }
    
    // Topper (opcjonalny)
    if (options.hasTopper && options.topperHeight) {
      components.push({
        name: 'Topper',
        type: 'wall',
        dimensions: { width, height: options.topperHeight, depth: 0 },
        surface: (width * options.topperHeight) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + options.topperHeight) / 1000,
        materialCost: 0
      });
    }
    
    // Przegrody (opcjonalne)
    if (options.hasDividers && options.dividersCount) {
      for (let i = 0; i < options.dividersCount; i++) {
        components.push({
          name: `Przegroda ${i + 1}`,
          type: 'partition',
          dimensions: { width: depth, height: height / 3, depth: 0 },
          surface: (depth * height / 3) / 1e6,
          weight: 0,
          edgeLength: 2 * (depth + height / 3) / 1000,
          materialCost: 0
        });
      }
    }
    
    return components;
  }