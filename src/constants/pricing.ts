// Pricing constants for plexi_appka

// constants/pricing.ts

export const MATERIAL_DENSITIES: Record<string, number> = {
    'PET-G': 1270,
    'Plexi': 1190,
    'Poliwęglan': 1200,
    'Dibond': 1500,
    'HIPS': 1050,
    'PCV': 1400,
    'default': 1200
  };
  
  export const PROFIT_MULTIPLIERS: Record<string, number | Record<string, number>> = {
    plyta: 1.8,
    pojemnik: 1.85,
    gablota: 1.85,
    obudowa: 1.8,
    kaseton: 1.0, // już zawiera marżę
    ledon: 5.0,
    ekspozytory: {
      podstawkowy: 2.2,
      schodkowy: 2.5,
      z_haczykami: 2.4,
      wiszacy: 2.2,
      stojak: 2.5,
      kosmetyczny: 2.7
    },
    impuls_kasowy: 1.8
  };
  
  export const WASTE_PERCENTAGES: Record<string, number> = {
    plyta: 0.05,      // 5%
    pojemnik: 0.08,   // 8%
    gablota: 0.08,    // 8%
    obudowa: 0.08,    // 8%
    ekspozytory: 0.12, // 12%
    default: 0.05
  };
  
  export const ADDON_PRICES = {
    wiercenie: 2.0,        // zł/otwór
    fazowanie: 6.0,        // zł/mb
    polerowanie: 9.0,      // zł/mb
    grafikaLatex: 75.0,    // zł/m²
    grawerowanie: 100.0,   // zł/h
    giecieNaGoraco: {      // zł/mb wg grubości
      1.5: 2,
      2: 4,
      3: 5,
      4: 7,
      5: 10,
      6: 20,
      8: 40,
      10: 80,
      12: 100,
      15: 125,
      20: 155
    }
  };
  
  export const IMPULS_LIMITER_HEIGHT = 60; // mm - wysokość ogranicznika na półkach