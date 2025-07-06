export const BENDING_PRICES = {
  3: 5,  // 5 zł/mb dla 3mm
  4: 6,  // 6 zł/mb dla 4mm
  5: 7   // 7 zł/mb dla 5mm
} as const;

export const IMPULS_LIMITER_HEIGHT = 100; // domyślna wysokość ogranicznika w mm

export const PROFIT_MULTIPLIERS = {
  default: 1.5,
  small: 1.3,
  large: 1.7,
  premium: 2.0
} as const;

export const WASTE_PERCENTAGES = {
  standard: 0.05,  // 5% odpadu
  complex: 0.10,   // 10% dla skomplikowanych kształtów
  minimal: 0.03    // 3% dla prostych formatek
} as const;

export const ADDON_PRICES = {
  drilling: 2.5,        // za otwór
  polishing: 15,        // za mb
  engraving: 50,        // za dm²
  mounting: 25,         // za komplet
  packaging: 10,        // za sztukę
  express: 0.3,         // mnożnik dla trybu ekspres
  customColor: 100      // dopłata za kolor niestandardowy
} as const;

export const MATERIAL_DENSITIES = {
  plexi: 1190,          // kg/m³
  plexiXT: 1190,
  plexiGS: 1180,
  petg: 1270,
  pc: 1200,
  pvc: 1380
} as const;

export const MATERIAL_PRICES = {
  plexi_clear: 30,      // zł/m² dla 1mm
  plexi_white: 35,
  plexi_colored: 40,
  petg: 45,
  pc: 60,
  pvc: 25
} as const;

export const THICKNESS_MULTIPLIERS = {
  2: 2.0,
  3: 3.0,
  4: 4.0,
  5: 5.0,
  6: 6.2,
  8: 8.5,
  10: 11.0,
  12: 13.5,
  15: 17.0,
  20: 23.0
} as const;