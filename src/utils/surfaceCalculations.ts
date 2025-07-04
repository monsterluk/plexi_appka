// Surface area calculations for plexi_appka

// utils/surfaceCalculations.ts

import { Dimensions, ContainerOptions, CabinetOptions, EnclosureOptions } from '../types';

/**
 * Oblicza powierzchnię pojemnika z uwzględnieniem wszystkich opcji
 */
export function calculateContainerSurface(
  dimensions: Dimensions,
  options: ContainerOptions
): ComponentCalculation[] {
  const { width, height, depth } = dimensions;
  const components: ComponentCalculation[] = [];
  
  // Ściany podstawowe (5)
  // Przód
  components.push({
    name: 'Przód',
    type: 'wall',
    dimensions: { width, height, depth: 0 },
    surface: (width * height) / 1e6,
    weight: 0, // obliczane później
    edgeLength: 2 * (width + height) / 1000,
    materialCost: 0
  });
  
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
  
  // Boki (2)
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
  
  // Dno
  components.push({
    name: 'Dno',
    type: 'base',
    dimensions: { width, height: depth, depth: 0 },
    surface: (width * depth) / 1e6,
    weight: 0,
    edgeLength: 2 * (width + depth) / 1000,
    materialCost: 0
  });
  
  // Opcjonalne wieko
  if (options.hasLid) {
    components.push({
      name: 'Wieko',
      type: 'lid',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
  }
  
  // Przegrody wzdłuż szerokości
  if (options.partitions.width.enabled && options.partitions.width.count > 0) {
    for (let i = 0; i < options.partitions.width.count; i++) {
      components.push({
        name: `Przegroda poprzeczna ${i + 1}`,
        type: 'partition',
        dimensions: { width: depth, height, depth: 0 },
        surface: (depth * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (depth + height) / 1000,
        materialCost: 0
      });
    }
  }
  
  // Przegrody wzdłuż długości
  if (options.partitions.length.enabled && options.partitions.length.count > 0) {
    for (let i = 0; i < options.partitions.length.count; i++) {
      components.push({
        name: `Przegroda podłużna ${i + 1}`,
        type: 'partition',
        dimensions: { width, height, depth: 0 },
        surface: (width * height) / 1e6,
        weight: 0,
        edgeLength: 2 * (width + height) / 1000,
        materialCost: 0
      });
    }
  }
  
  return components;
}

/**
 * Oblicza powierzchnię gabloty
 */
export function calculateCabinetSurface(
  dimensions: Dimensions,
  options: CabinetOptions
): ComponentCalculation[] {
  const { width, height, depth } = dimensions;
  const components: ComponentCalculation[] = [];
  
  // Gablota = pojemnik bez frontu i bez dna
  
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
  
  // Boki
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
  
  // Przegrody
  if (options.partitions.enabled && options.partitions.count > 0) {
    const isHorizontal = options.partitions.direction === 'horizontal';
    for (let i = 0; i < options.partitions.count; i++) {
      components.push({
        name: `Przegroda ${i + 1}`,
        type: 'partition',
        dimensions: isHorizontal 
          ? { width, height: depth, depth: 0 }
          : { width: depth, height, depth: 0 },
        surface: isHorizontal 
          ? (width * depth) / 1e6 
          : (depth * height) / 1e6,
        weight: 0,
        edgeLength: isHorizontal 
          ? 2 * (width + depth) / 1000
          : 2 * (depth + height) / 1000,
        materialCost: 0
      });
    }
  }
  
  // Podstawa z innego materiału liczona osobno
  // (nie dodajemy tutaj, będzie w osobnej kalkulacji)
  
  return components;
}

/**
 * Oblicza powierzchnię obudowy z wybranymi ścianami
 */
export function calculateEnclosureSurface(
  dimensions: Dimensions,
  options: EnclosureOptions
): ComponentCalculation[] {
  const { width, height, depth } = dimensions;
  const components: ComponentCalculation[] = [];
  
  // Sprawdzamy każdą ścianę
  if (options.walls.front) {
    components.push({
      name: 'Przód',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
  }
  
  if (options.walls.back) {
    components.push({
      name: 'Tył',
      type: 'wall',
      dimensions: { width, height, depth: 0 },
      surface: (width * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + height) / 1000,
      materialCost: 0
    });
  }
  
  if (options.walls.left) {
    components.push({
      name: 'Lewy bok',
      type: 'wall',
      dimensions: { width: depth, height, depth: 0 },
      surface: (depth * height) / 1e6,
      weight: 0,
      edgeLength: 2 * (depth + height) / 1000,
      materialCost: 0
    });
  }
  
  if (options.walls.right) {
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
  
  if (options.walls.top) {
    components.push({
      name: 'Góra',
      type: 'wall',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
  }
  
  if (options.walls.bottom) {
    components.push({
      name: 'Dół',
      type: 'wall',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
  }
  
  return components;
}

/**
 * Oblicza powierzchnię impulsu kasowego
 */
export function calculateImpulsSurface(
  dimensions: Dimensions,
  options: ImpulsOptions
): ComponentCalculation[] {
  const { width, height, depth } = dimensions;
  const components: ComponentCalculation[] = [];
  
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
  
  // Boki
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
  
  // Półki z ogranicznikami 60mm
  for (let i = 0; i < options.shelvesCount; i++) {
    // Sama półka
    components.push({
      name: `Półka ${i + 1}`,
      type: 'shelf',
      dimensions: { width, height: depth, depth: 0 },
      surface: (width * depth) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + depth) / 1000,
      materialCost: 0
    });
    
    // Ogranicznik (zagięcie 60mm)
    components.push({
      name: `Ogranicznik półki ${i + 1}`,
      type: 'shelf',
      dimensions: { width, height: IMPULS_LIMITER_HEIGHT, depth: 0 },
      surface: (width * IMPULS_LIMITER_HEIGHT) / 1e6,
      weight: 0,
      edgeLength: 2 * (width + IMPULS_LIMITER_HEIGHT) / 1000,
      materialCost: 0
    });
  }
  
  return components;
}