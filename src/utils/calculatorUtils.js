// utils/calculatorUtils.js

import { MATERIAL_DENSITIES, WASTE_DEFAULTS } from '../constants/calculator';

/**
 * Oblicza powierzchnię produktu w m²
 * @param {string} productType - typ produktu
 * @param {number} width - szerokość w mm
 * @param {number} height - wysokość w mm
 * @param {number} depth - głębokość w mm (opcjonalna)
 * @param {number} quantity - ilość sztuk
 * @returns {number} powierzchnia w m²
 */
export function calculateSurfaceArea(productType, width, height, depth, quantity) {
  // Konwersja mm² na m²
  const toM2 = (value) => value / 1000000;
  
  // Produkty 3D wymagające obliczenia wszystkich ścian
  const needs3D = ['pojemnik', 'gablota', 'obudowa'];
  
  if (needs3D.includes(productType) && depth > 0) {
    let totalSurface = 0;
    
    switch(productType) {
      case 'pojemnik':
        // Pojemnik: 5 ścian (bez góry)
        totalSurface = toM2(
          2 * (width * height) +      // przód i tył
          2 * (depth * height) +      // boki
          (width * depth)             // tylko dno
        );
        break;
        
      case 'gablota':
        // Gablota: 4 ściany (bez frontu)
        totalSurface = toM2(
          (width * height) +          // tylko tył
          2 * (depth * height) +      // boki
          (width * depth)             // dno
        );
        break;
        
      case 'obudowa':
        // Obudowa: wszystkie 6 ścian
        totalSurface = toM2(
          2 * (width * height) +      // przód i tył
          2 * (depth * height) +      // boki
          2 * (width * depth)         // góra i dół
        );
        break;
    }
    
    return totalSurface * quantity;
  }
  
  // Produkty 2D (płyty)
  return toM2(width * height * quantity);
}

/**
 * Oblicza wagę produktu w kg
 * @param {number} surfaceArea - powierzchnia w m²
 * @param {number} thickness - grubość w mm
 * @param {string} materialType - typ materiału
 * @returns {number} waga w kg
 */
export function calculateWeight(surfaceArea, thickness, materialType) {
  // Poprawka: waga = powierzchnia × grubość × gęstość
  // gdzie gęstość jest w kg/m³, więc dla mm musimy przeliczyć
  const density = MATERIAL_DENSITIES[materialType] || MATERIAL_DENSITIES.default;
  
  // Przeliczenie: thickness w mm na m
  const thicknessInMeters = thickness / 1000;
  
  // Objętość w m³
  const volume = surfaceArea * thicknessInMeters;
  
  // Waga = objętość × gęstość
  return volume * density;
}

/**
 * Oblicza długość krawędzi do polerowania
 * @param {string} productType - typ produktu
 * @param {number} width - szerokość w mm
 * @param {number} height - wysokość w mm
 * @param {number} depth - głębokość w mm
 * @returns {number} długość krawędzi w metrach
 */
export function calculateEdgeLength(productType, width, height, depth) {
  // Konwersja mm na m
  const toMeters = (value) => value / 1000;
  
  switch(productType) {
    case 'plyta':
      // Formatka: 2×szerokość + 2×wysokość
      return toMeters(2 * width + 2 * height);
      
    case 'pojemnik':
      // Pojemnik (5 ścian): wszystkie krawędzie zewnętrzne
      // 4 krawędzie górne + 4 pionowe + 4 dolne
      return toMeters(
        4 * width +      // górne krawędzie (przód, tył, 2 boki)
        4 * height +     // krawędzie pionowe
        4 * depth        // krawędzie głębokości
      );
      
    case 'gablota':
      // Gablota (4 ściany, bez frontu): 
      // 3 krawędzie górne + 4 pionowe + 4 dolne
      return toMeters(
        3 * width +      // górne krawędzie (bez frontu)
        4 * height +     // krawędzie pionowe
        4 * depth        // krawędzie głębokości
      );
      
    case 'obudowa':
      // Obudowa (6 ścian): wszystkie krawędzie
      // 12 krawędzi (jak sześcian)
      return toMeters(
        4 * width +
        4 * height +
        4 * depth
      );
      
    default:
      // Domyślnie jak formatka
      return toMeters(2 * width + 2 * height);
  }
}

/**
 * Oblicza odpad produkcyjny
 * @param {number} quantity - ilość sztuk
 * @returns {number} odpad w mm
 */
export function calculateWaste(quantity) {
  if (quantity <= WASTE_DEFAULTS.small_series.qty) {
    return WASTE_DEFAULTS.small_series.waste;
  }
  return WASTE_DEFAULTS.large_series.waste;
}

/**
 * Oblicza powierzchnię kartonu FEFCO 0201
 * @param {number} width - szerokość produktu w mm
 * @param {number} height - wysokość produktu w mm
 * @param {number} depth - głębokość produktu w mm
 * @returns {number} powierzchnia kartonu w m²
 */
export function calculateCartonSurface(width, height, depth) {
  // Dodajemy marginesy dla kartonu
  const cartonWidth = width + 10;
  const cartonDepth = depth + 10;
  const cartonHeight = height + 30;
  
  // Wzór dla kartonu klapowego FEFCO 0201
  // 2 × (szerokość + głębokość) × (wysokość + 30mm na klapy)
  const surfaceAreaMm2 = 2 * (cartonWidth + cartonDepth) * (cartonHeight + 30);
  
  // Konwersja na m²
  return surfaceAreaMm2 / 1000000;
}

/**
 * Oblicza ilość produktów na palecie
 * @param {object} productDimensions - wymiary produktu {width, height, depth}
 * @param {object} palletDimensions - wymiary palety
 * @returns {number} ilość produktów na palecie
 */
export function calculateProductsPerPallet(productDimensions, palletDimensions) {
  const orientations = [
    { w: productDimensions.width, l: productDimensions.height, h: productDimensions.depth },
    { w: productDimensions.width, l: productDimensions.depth, h: productDimensions.height },
    { w: productDimensions.height, l: productDimensions.depth, h: productDimensions.width }
  ];
  
  let maxProducts = 0;
  
  orientations.forEach(orient => {
    const productsPerLayer = Math.floor(palletDimensions.width / orient.w) * 
                           Math.floor(palletDimensions.length / orient.l);
    const maxLayers = Math.floor(palletDimensions.maxHeight / orient.h);
    const productsThisOrientation = productsPerLayer * maxLayers;
    
    if (productsThisOrientation > maxProducts) {
      maxProducts = productsThisOrientation;
    }
  });
  
  return maxProducts;
}