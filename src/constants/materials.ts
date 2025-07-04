// Material constants for plexi_appka
import { Material } from '../types/materials.types';

export const AVAILABLE_MATERIALS: Material[] = [
  {
    id: 'acrylic-clear-3mm',
    name: 'Plexi bezbarwne 3mm',
    density: 1190, // kg/m³
    thickness: 3, // mm
    pricePerSquareMeter: 45.00 // PLN/m²
  },
  {
    id: 'acrylic-clear-5mm',
    name: 'Plexi bezbarwne 5mm',
    density: 1190,
    thickness: 5,
  }
];

export const DEFAULT_MATERIAL = AVAILABLE_MATERIALS[0];  },
  {
    id: 'acrylic-white-3mm',
    name: 'Plexi białe 3mm',
    density: 1190,
    thickness: 3,
    pricePerSquareMeter: 50.00
  },
  {
    id: 'polycarbonate-clear-4mm',
    name: 'Poliwęglan bezbarwny 4mm',
    density: 1200,
    thickness: 4,
    pricePerSquareMeter: 85.00
  }
