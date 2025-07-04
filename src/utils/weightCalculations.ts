// Weight calculations utilities for plexi materials
// utils/weightCalculations.ts

import { ComponentCalculation, MaterialSpec } from '../types';
import { MATERIAL_DENSITIES } from '../constants/pricing';

/**
 * Oblicza wagę pojedynczego komponentu
 * Waga = powierzchnia × grubość × gęstość
 */
export function calculateComponentWeight(
  component: ComponentCalculation,
  material: MaterialSpec,
  thickness: number // mm
): number {
  // Pobierz gęstość materiału
  const density = MATERIAL_DENSITIES[material.name] || MATERIAL_DENSITIES.default;
  
  // Objętość w m³ = powierzchnia (m²) × grubość (m)
  const volume = component.surface * (thickness / 1000);
  
  // Waga = objętość × gęstość
  return volume * density;
}

/**
 * Oblicza całkowitą wagę wszystkich komponentów
 */
export function calculateTotalWeight(
  components: ComponentCalculation[],
  material: MaterialSpec,
  thickness: number
): number {
  return components.reduce((total, component) => {
    const componentWeight = calculateComponentWeight(component, material, thickness);
    // Aktualizuj wagę w komponencie
    component.weight = componentWeight;
    return total + componentWeight;
  }, 0);
}

/**
 * Oblicza wagę z uwzględnieniem różnych materiałów
 * (np. podstawa gabloty z innego materiału)
 */
export function calculateMixedMaterialsWeight(
  mainComponents: ComponentCalculation[],
  mainMaterial: MaterialSpec,
  mainThickness: number,
  customComponents: Array<{
    component: ComponentCalculation;
    material: MaterialSpec;
    thickness: number;
  }>
): number {
  // Waga głównych komponentów
  const mainWeight = calculateTotalWeight(mainComponents, mainMaterial, mainThickness);
  
  // Waga komponentów z innych materiałów
  const customWeight = customComponents.reduce((total, item) => {
    return total + calculateComponentWeight(item.component, item.material, item.thickness);
  }, 0);
  
  return mainWeight + customWeight;
}