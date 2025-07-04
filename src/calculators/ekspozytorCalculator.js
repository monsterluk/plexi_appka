// calculators/ekspozytorCalculator.js

import { PROFIT_MULTIPLIERS } from '../constants/calculator';

/**
 * Kalkulator dla ekspozytorów
 * Różne typy z różnymi mnożnikami
 */
export function calculateEkspozytor(params) {
  const { 
    type,          // podstawkowy, schodkowy, z_haczykami, etc.
    width, 
    height, 
    depth,
    thickness,
    plexiType,
    quantity,
    // Opcje specyficzne
    levels,        // dla schodkowego
    hooks,         // dla z haczykami
    shelves,       // dla różnych typów
    graphics,      // typ grafiki
    topper         // wysokość topera
  } = params;
  
  // Oblicz powierzchnię w zależności od typu
  let totalSurface = 0;
  const multiplier = PROFIT_MULTIPLIERS.ekspozytory[type] || 2.5;
  
  switch(type) {
    case 'podstawkowy':
      // Podstawa + ścianka tylna + opcjonalne boki
      totalSurface = (
        (width * depth) +           // podstawa
        (width * height) +          // tył
        (params.hasSides ? 2 * (depth * height) : 0)  // boki
      ) / 1000000;
      break;
      
    case 'schodkowy':
      // Podstawa + poziomy + boki + plecy
      totalSurface = (
        (width * depth) +           // podstawa
        levels * (width * depth) +  // poziomy
        2 * (height * depth) +      // boki
        (width * height)            // plecy
      ) / 1000000;
      break;
      
    case 'z_haczykami':
      // Płyta tylna + opcjonalne elementy
      totalSurface = (
        (width * height) +          // płyta tylna
        (params.hasBase ? (width * depth) : 0) +      // podstawa
        (params.hasSides ? 2 * (height * depth) : 0)  // boki
      ) / 1000000;
      break;
      
    case 'kosmetyczny':
      // Złożona konstrukcja z wieloma elementami
      totalSurface = (
        (width * depth) +           // podstawa
        (params.hasSecondBottom ? (width * depth) : 0) +  // drugie dno
        (width * height) +          // plecy
        2 * (height * depth) +      // boki
        (shelves * (width * depth)) // półki z otworami
      ) / 1000000;
      
      // Dodaj topper jeśli jest
      if (topper && topper.height > 0) {
        totalSurface += (width * topper.height) / 1000000;
      }
      break;
  }
  
  // Cena plexi
  const plexiPrices = {
    bezbarwna: 30,
    mleczna_czarna_biala: 33,
    kolorowa_3mm: 120,
    kolorowa_5mm: 200
  };
  
  // Podstawowy koszt materiału
  let materialCost = totalSurface * plexiPrices[plexiType] * thickness;
  
  // Dodaj 12% odpadu
  materialCost *= 1.12;
  
  // Zastosuj mnożnik typu
  materialCost *= multiplier;
  
  // Koszt grafiki (bez mnożnika!)
  let graphicsCost = 0;
  if (graphics === 'single') {
    graphicsCost = totalSurface * 75;  // 75 zł/m²
  } else if (graphics === 'double') {
    graphicsCost = totalSurface * 150; // 150 zł/m²
  }
  
  // Koszt haczyków (bez mnożnika!)
  const hooksCost = hooks ? hooks * 2 : 0; // 2 zł/szt
  
  return {
    surface: totalSurface * quantity,
    materialCost: materialCost * quantity,
    graphicsCost: graphicsCost * quantity,
    hooksCost: hooksCost * quantity,
    totalCost: (materialCost + graphicsCost + hooksCost) * quantity,
    thickness: thickness,
    multiplier: multiplier
  };
}