// calculators/calculateExpVariant.ts

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
  
  interface ExpVariantResult {
    components: ComponentCalculation[];
    additionalElements: {
      name: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
    specialCalculations: {
      holesCount?: number;
      holesCuttingCost?: number;
      bendingLength?: number;
      bendingCost?: number;
      mountingCost?: number;
    };
  }
  
  export function calculateExpVariant(
    dimensions: { width: number; height: number; depth: number },
    options: EkspozytorOptions
  ): ExpVariantResult {
    switch (options.subtype) {
      case 'podstawkowy':
        return calculatePodstawkowyVariant(dimensions, options);
      case 'schodkowy':
        return calculateSchodkowyVariant(dimensions, options);
      case 'z_haczykami':
        return calculateZHaczykamiVariant(dimensions, options);
      case 'wiszacy':
        return calculateWiszacyVariant(dimensions, options);
      case 'stojak':
        return calculateStojakVariant(dimensions, options);
      case 'kosmetyczny':
        return calculateKosmetycznyVariant(dimensions, options);
      default:
        throw new Error(`Nieznany typ ekspozytora: ${options.subtype}`);
    }
  }
  
  function calculatePodstawkowyVariant(
    dimensions: { width: number; height: number; depth: number },
    options: PodstawkowyOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
  
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
      surface: (dimensions.width * dimensions.depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.depth) / 1000,
      materialCost: 0
    });
  
    // Ścianka tylna
    components.push({
      name: 'Ścianka tylna',
      type: 'wall',
      dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
      surface: (dimensions.width * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Boki opcjonalne
    if (options.hasSides) {
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
        surface: (dimensions.depth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
        surface: (dimensions.depth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
        materialCost: 0
      });
    }
  
    // Łączniki
    if (options.hasLaczniki) {
      const cornersCount = options.hasSides ? 6 : 2;
      additionalElements.push({
        name: 'Kątowniki łączące',
        quantity: cornersCount,
        unitCost: 3,
        totalCost: cornersCount * 3
      });
    }
  
    return {
      components,
      additionalElements,
      specialCalculations: {}
    };
  }
  
  function calculateSchodkowyVariant(
    dimensions: { width: number; height: number; depth: number },
    options: SchodkowyOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
  
    // Oblicz wymiary dla każdego poziomu
    const levelHeight = dimensions.height / options.levels;
    const levelDepthIncrement = dimensions.depth / options.levels;
  
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
      surface: (dimensions.width * dimensions.depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.depth) / 1000,
      materialCost: 0
    });
  
    // Poziomy (półki schodkowe)
    for (let i = 0; i < options.levels; i++) {
      const currentDepth = dimensions.depth - (i * levelDepthIncrement);
      components.push({
        name: `Poziom ${i + 1}`,
        type: 'shelf',
        dimensions: { width: dimensions.width, height: currentDepth, depth: 0 },
        surface: (dimensions.width * currentDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + currentDepth) / 1000,
        materialCost: 0
      });
  
      // Podpora pionowa dla poziomu
      if (i > 0) {
        components.push({
          name: `Podpora poziomu ${i + 1}`,
          type: 'wall',
          dimensions: { width: dimensions.width, height: levelHeight, depth: 0 },
          surface: (dimensions.width * levelHeight) / 1e6,
          weight: 0,
          edgeLength: 2 * (dimensions.width + levelHeight) / 1000,
          materialCost: 0
        });
      }
    }
  
    // Boki (zawsze w schodkowym)
    const sideShape = calculateSteppedSideArea(dimensions.height, dimensions.depth, options.levels);
    components.push({
      name: 'Lewy bok schodkowy',
      type: 'wall',
      dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
      surface: sideShape.area / 1e6,
      weight: 0,
      edgeLength: sideShape.perimeter / 1000,
      materialCost: 0
    });
  
    components.push({
      name: 'Prawy bok schodkowy',
      type: 'wall',
      dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
      surface: sideShape.area / 1e6,
      weight: 0,
      edgeLength: sideShape.perimeter / 1000,
      materialCost: 0
    });
  
    // Plecy opcjonalne
    if (options.hasBack) {
      components.push({
        name: 'Plecy',
        type: 'wall',
        dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
        surface: (dimensions.width * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
        materialCost: 0
      });
    }
  
    // Kątowniki do montażu
    const jointsCount = options.levels * 4 + (options.hasBack ? 4 : 0);
    additionalElements.push({
      name: 'Kątowniki montażowe',
      quantity: jointsCount,
      unitCost: 2.5,
      totalCost: jointsCount * 2.5
    });
  
    return {
      components,
      additionalElements,
      specialCalculations: {}
    };
  }
  
  function calculateZHaczykamiVariant(
    dimensions: { width: number; height: number; depth: number },
    options: ZHaczykamiOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
  
    // Płyta tylna z otworami
    components.push({
      name: 'Płyta tylna z otworami',
      type: 'wall',
      dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
      surface: (dimensions.width * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Podstawa opcjonalna
    if (options.hasBase) {
      const baseDepth = options.baseDepth || 200;
      components.push({
        name: 'Podstawa',
        type: 'base',
        dimensions: { width: dimensions.width, height: baseDepth, depth: 0 },
        surface: (dimensions.width * baseDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + baseDepth) / 1000,
        materialCost: 0
      });
  
      // Wspornik podstawy
      components.push({
        name: 'Wspornik podstawy',
        type: 'wall',
        dimensions: { width: dimensions.width, height: 50, depth: 0 },
        surface: (dimensions.width * 50) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + 50) / 1000,
        materialCost: 0
      });
    }
  
    // Boki opcjonalne
    if (options.hasSides) {
      const sideDepth = options.hasBase ? (options.baseDepth || 200) : 100;
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: sideDepth, height: dimensions.height, depth: 0 },
        surface: (sideDepth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (sideDepth + dimensions.height) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: sideDepth, height: dimensions.height, depth: 0 },
        surface: (sideDepth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (sideDepth + dimensions.height) / 1000,
        materialCost: 0
      });
    }
  
    // Haczyki
    additionalElements.push({
      name: 'Haczyki metalowe/plastikowe',
      quantity: options.hooksCount,
      unitCost: 2,
      totalCost: options.hooksCount * 2
    });
  
    // Oblicz liczbę otworów do wywiercenia
    const holesCount = options.hooksCount;
    const holesDrillingCost = holesCount * 0.5; // 0.50 zł za otwór
  
    return {
      components,
      additionalElements,
      specialCalculations: {
        holesCount,
        holesCuttingCost: holesDrillingCost
      }
    };
  }
  
  function calculateWiszacyVariant(
    dimensions: { width: number; height: number; depth: number },
    options: WiszacyOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
  
    // Płyta tylna
    components.push({
      name: 'Płyta tylna montażowa',
      type: 'wall',
      dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
      surface: (dimensions.width * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Półki
    const shelfSpacing = dimensions.height / (options.shelvesCount + 1);
    for (let i = 0; i < options.shelvesCount; i++) {
      components.push({
        name: `Półka ${i + 1}`,
        type: 'shelf',
        dimensions: { width: dimensions.width, height: options.shelfDepth, depth: 0 },
        surface: (dimensions.width * options.shelfDepth) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + options.shelfDepth) / 1000,
        materialCost: 0
      });
  
      // Wsporniki półek
      components.push({
        name: `Wspornik półki ${i + 1} - lewy`,
        type: 'wall',
        dimensions: { 
          width: options.shelfDepth * 0.7, 
          height: options.shelfDepth * 0.5, 
          depth: 0 
        },
        surface: (options.shelfDepth * 0.7 * options.shelfDepth * 0.5) / 1e6,
        weight: 0,
        edgeLength: calculateTrianglePerimeter(options.shelfDepth * 0.7, options.shelfDepth * 0.5) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: `Wspornik półki ${i + 1} - prawy`,
        type: 'wall',
        dimensions: { 
          width: options.shelfDepth * 0.7, 
          height: options.shelfDepth * 0.5, 
          depth: 0 
        },
        surface: (options.shelfDepth * 0.7 * options.shelfDepth * 0.5) / 1e6,
        weight: 0,
        edgeLength: calculateTrianglePerimeter(options.shelfDepth * 0.7, options.shelfDepth * 0.5) / 1000,
        materialCost: 0
      });
    }
  
    // Boki opcjonalne
    if (options.hasSides) {
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: options.shelfDepth, height: dimensions.height, depth: 0 },
        surface: (options.shelfDepth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (options.shelfDepth + dimensions.height) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: options.shelfDepth, height: dimensions.height, depth: 0 },
        surface: (options.shelfDepth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (options.shelfDepth + dimensions.height) / 1000,
        materialCost: 0
      });
    }
  
    // System montażu
    let mountingCost = 0;
    switch (options.mountingType) {
      case 'hooks':
        additionalElements.push({
          name: 'Haczyki montażowe wzmocnione',
          quantity: 2,
          unitCost: 15,
          totalCost: 30
        });
        mountingCost = 30;
        break;
      case 'magnets':
        const magnetsCount = 4 + (options.shelvesCount * 2);
        additionalElements.push({
          name: 'Magnesy neodymowe',
          quantity: magnetsCount,
          unitCost: 4,
          totalCost: magnetsCount * 4
        });
        mountingCost = magnetsCount * 4;
        break;
      case 'screws':
        additionalElements.push({
          name: 'Uchwyty ścienne z kołkami',
          quantity: 4,
          unitCost: 5,
          totalCost: 20
        });
        mountingCost = 20;
        break;
    }
  
    return {
      components,
      additionalElements,
      specialCalculations: {
        mountingCost
      }
    };
  }
  
  function calculateStojakVariant(
    dimensions: { width: number; height: number; depth: number },
    options: StojakOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
  
    // Podstawa wzmocniona
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
      surface: (dimensions.width * dimensions.depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.depth) / 1000,
      materialCost: 0
    });
  
    // Płyta stabilizująca
    components.push({
      name: 'Płyta stabilizująca',
      type: 'base',
      dimensions: { width: dimensions.width * 0.8, height: dimensions.depth * 0.8, depth: 0 },
      surface: (dimensions.width * 0.8 * dimensions.depth * 0.8) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width * 0.8 + dimensions.depth * 0.8) / 1000,
      materialCost: 0
    });
  
    // Plecy
    components.push({
      name: 'Plecy',
      type: 'wall',
      dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
      surface: (dimensions.width * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Boki opcjonalne
    if (options.hasSides) {
      components.push({
        name: 'Lewy bok',
        type: 'wall',
        dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
        surface: (dimensions.depth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: 'Prawy bok',
        type: 'wall',
        dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
        surface: (dimensions.depth * dimensions.height) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
        materialCost: 0
      });
    }
  
    // Półki
    if (options.shelvesCount > 0) {
      const shelfSpacing = dimensions.height / (options.shelvesCount + 1);
      for (let i = 0; i < options.shelvesCount; i++) {
        components.push({
          name: `Półka ${i + 1}`,
          type: 'shelf',
          dimensions: { width: dimensions.width, height: options.shelfDepth, depth: 0 },
          surface: (dimensions.width * options.shelfDepth) / 1e6,
          weight: 0,
          edgeLength: 2 * (dimensions.width + options.shelfDepth) / 1000,
          materialCost: 0
        });
  
        // Wsporniki półek
        if (!options.hasSides) {
          additionalElements.push({
            name: `Wsporniki półki ${i + 1}`,
            quantity: 2,
            unitCost: 4,
            totalCost: 8
          });
        }
      }
    }
  
    // Stopki antypoślizgowe
    additionalElements.push({
      name: 'Stopki antypoślizgowe',
      quantity: 4,
      unitCost: 1.5,
      totalCost: 6
    });
  
    return {
      components,
      additionalElements,
      specialCalculations: {}
    };
  }
  
  function calculateKosmetycznyVariant(
    dimensions: { width: number; height: number; depth: number },
    options: KosmetycznyOptions
  ): ExpVariantResult {
    const components: ComponentCalculation[] = [];
    const additionalElements: any[] = [];
    
    // Podstawa
    components.push({
      name: 'Podstawa',
      type: 'base',
      dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
      surface: (dimensions.width * dimensions.depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.depth) / 1000,
      materialCost: 0
    });
  
    // Drugie dno opcjonalne
    if (options.hasSecondBottom) {
      components.push({
        name: 'Drugie dno',
        type: 'base',
        dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
        surface: (dimensions.width * dimensions.depth) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + dimensions.depth) / 1000,
        materialCost: 0
      });
  
      // Dystanse między dnami
      additionalElements.push({
        name: 'Dystanse między dnami',
        quantity: 4,
        unitCost: 3,
        totalCost: 12
      });
    }
  
    // Boki (zawsze)
    components.push({
      name: 'Lewy bok',
      type: 'wall',
      dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
      surface: (dimensions.depth * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
      materialCost: 0
    });
  
    components.push({
      name: 'Prawy bok',
      type: 'wall',
      dimensions: { width: dimensions.depth, height: dimensions.height, depth: 0 },
      surface: (dimensions.depth * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.depth + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Plecy
    components.push({
      name: 'Plecy',
      type: 'wall',
      dimensions: { width: dimensions.width, height: dimensions.height, depth: 0 },
      surface: (dimensions.width * dimensions.height) / 1e6,
      weight: 0,
      edgeLength: 2 * (dimensions.width + dimensions.height) / 1000,
      materialCost: 0
    });
  
    // Półki z otworami
    const holesDiameter = Math.floor(dimensions.width / (options.holesPerShelf + 1));
    const holesArea = Math.PI * Math.pow(holesDiameter / 2, 2) * options.holesPerShelf;
    const shelfNetArea = (dimensions.width * dimensions.depth) - holesArea;
  
    for (let i = 0; i < options.shelvesWithHoles; i++) {
      components.push({
        name: `Półka z otworami ${i + 1}`,
        type: 'shelf',
        dimensions: { width: dimensions.width, height: dimensions.depth, depth: 0 },
        surface: shelfNetArea / 1e6,
        weight: 0,
        // Dodatkowe krawędzie z otworów
        edgeLength: (2 * (dimensions.width + dimensions.depth) + 
                     options.holesPerShelf * Math.PI * holesDiameter) / 1000,
        materialCost: 0
      });
    }
  
    // Topper opcjonalny
    if (options.hasTopper && options.topperHeight) {
      components.push({
        name: 'Topper dekoracyjny',
        type: 'wall',
        dimensions: { width: dimensions.width, height: options.topperHeight, depth: 0 },
        surface: (dimensions.width * options.topperHeight) / 1e6,
        weight: 0,
        edgeLength: 2 * (dimensions.width + options.topperHeight) / 1000,
        materialCost: 0
      });
  
      // Wsporniki toppera
      components.push({
        name: 'Wspornik toppera lewy',
        type: 'wall',
        dimensions: { width: dimensions.depth * 0.5, height: options.topperHeight * 0.7, depth: 0 },
        surface: (dimensions.depth * 0.5 * options.topperHeight * 0.7) / 1e6,
        weight: 0,
        edgeLength: calculateTrianglePerimeter(dimensions.depth * 0.5, options.topperHeight * 0.7) / 1000,
        materialCost: 0
      });
  
      components.push({
        name: 'Wspornik toppera prawy',
        type: 'wall',
        dimensions: { width: dimensions.depth * 0.5, height: options.topperHeight * 0.7, depth: 0 },
        surface: (dimensions.depth * 0.5 * options.topperHeight * 0.7) / 1e6,
        weight: 0,
        edgeLength: calculateTrianglePerimeter(dimensions.depth * 0.5, options.topperHeight * 0.7) / 1000,
        materialCost: 0
      });
    }
  
    // Przegrody opcjonalne
    if (options.hasDividers && options.dividersCount) {
      const dividerHeight = dimensions.height / 3; // 1/3 wysokości
      for (let i = 0; i < options.dividersCount; i++) {
        components.push({
          name: `Przegroda ${i + 1}`,
          type: 'partition',
          dimensions: { width: dimensions.depth, height: dividerHeight, depth: 0 },
          surface: (dimensions.depth * dividerHeight) / 1e6,
          weight: 0,
          edgeLength: 2 * (dimensions.depth + dividerHeight) / 1000,
          materialCost: 0
        });
      }
    }
  
    // Obliczenia specjalne
    const totalHolesCount = options.shelvesWithHoles * options.holesPerShelf;
    const holesCuttingCost = totalHolesCount * 5; // 5 zł za wycięcie otworu
  
    // Elementy montażowe
    additionalElements.push({
      name: 'System półek regulowanych',
      quantity: options.shelvesWithHoles * 4,
      unitCost: 1.5,
      totalCost: options.shelvesWithHoles * 4 * 1.5
    });
  
    return {
      components,
      additionalElements,
      specialCalculations: {
        holesCount: totalHolesCount,
        holesCuttingCost: holesCuttingCost
      }
    };
  }
  
  // Funkcje pomocnicze
  
  function calculateSteppedSideArea(
    height: number, 
    depth: number, 
    levels: number
  ): { area: number; perimeter: number } {
    // Oblicz powierzchnię boku schodkowego
    const stepHeight = height / levels;
    const stepDepth = depth / levels;
    
    // Powierzchnia to prostokąt minus wycięte schody
    const fullArea = height * depth;
    const cutoutArea = (levels - 1) * stepHeight * stepDepth / 2;
    const area = fullArea - cutoutArea;
    
    // Obwód schodkowy
    const perimeter = height + depth + 
      Math.sqrt(stepHeight * stepHeight + stepDepth * stepDepth) * levels;
    
    return { area, perimeter };
  }
  
  function calculateTrianglePerimeter(base: number, height: number): number {
    const hypotenuse = Math.sqrt(base * base + height * height);
    return base + height + hypotenuse;
  }