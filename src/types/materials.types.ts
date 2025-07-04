// Material types for plexi_appka

export interface Material {
  id: string;
  name: string;
  density: number; // kg/m³
  thickness: number; // mm
  pricePerSquareMeter: number; // PLN/m²
}

export interface MaterialProperties {
  density: number;
  flexuralStrength: number;
  tensileStrength: number;
  thermalExpansion: number;
}

export type MaterialType = 'acrylic' | 'polycarbonate' | 'petg' | 'abs';
