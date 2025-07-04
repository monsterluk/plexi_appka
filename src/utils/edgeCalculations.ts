// Edge calculations utilities for plexi materials
// utils/edgeCalculations.ts

import { ComponentCalculation, EnclosureOptions } from '../types';

/**
 * Oblicza całkowitą długość krawędzi do polerowania
 * Uwzględnia tylko zewnętrzne krawędzie
 */
export function calculateTotalEdgeLength(
  components: ComponentCalculation[],
  productType: string,
  options?: any
): number {
  // Dla obudowy - liczymy tylko zaznaczone ściany
  if (productType === 'obudowa' && options) {
    const enclosureOptions = options as EnclosureOptions;
    let totalLength = 0;
    
    // Liczymy tylko krawędzie dla istniejących ścian
    components.forEach(component => {
      totalLength += component.edgeLength;
    });
    
    return totalLength;
  }
  
  // Dla pojemnika - wszystkie krawędzie zewnętrzne
  if (productType === 'pojemnik') {
    // Suma wszystkich krawędzi komponentów
    return components
      .filter(c => c.type !== 'partition') // Przegrody mogą nie wymagać polerowania
      .reduce((total, component) => total + component.edgeLength, 0);
  }
  
  // Dla gabloty - bez frontu
  if (productType === 'gablota') {
    return components
      .filter(c => c.name !== 'Przód' && c.type !== 'partition')
      .reduce((total, component) => total + component.edgeLength, 0);
  }
  
  // Dla ekspozytorów - zależy od typu
  if (productType === 'ekspozytory') {
    // Półki z otworami mają dodatkowe krawędzie wewnętrzne
    let baseLength = components.reduce((total, component) => total + component.edgeLength, 0);
    
    // Dodaj krawędzie otworów jeśli są
    if (options?.holesCount) {
      const holePerimeter = 200; // mm - przykładowy obwód otworu
      baseLength += (options.holesCount * holePerimeter) / 1000;
    }
    
    return baseLength;
  }
  
  // Domyślnie - suma wszystkich krawędzi
  return components.reduce((total, component) => total + component.edgeLength, 0);
}

/**
 * Oblicza długość krawędzi dla półek z ogranicznikami
 */
export function calculateShelfWithLimiterEdges(
  shelfWidth: number,
  shelfDepth: number,
  limiterHeight: number
): number {
  // Krawędzie półki
  const shelfEdges = 2 * (shelfWidth + shelfDepth);
  
  // Krawędzie ogranicznika (tylko górna i boczne)
  const limiterEdges = shelfWidth + 2 * limiterHeight;
  
  return (shelfEdges + limiterEdges) / 1000; // w metrach
}