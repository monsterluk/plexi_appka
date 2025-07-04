// constants/calculator.js

// Gęstości materiałów w kg/m³
export const MATERIAL_DENSITIES = {
    'PET-G': 1270,
    'Plexi': 1190,
    'Poliwęglan': 1200,
    'Dibond': 1500,
    'HIPS': 1050,
    'PCV': 1400,
    'default': 1200
  };
  
  // Mnożniki zysku dla różnych typów produktów
  export const PROFIT_MULTIPLIERS = {
    plyta: 1.8,              // Płyty standardowe
    pojemnik: 1.85,          // Pojemniki/organizery
    gablota: 1.85,           // Gabloty
    obudowa: 1.8,            // Obudowy/osłony
    kaseton: 1.0,            // Kaseton - cena już zawiera marżę
    ledon: 5.0,              // LEDON - specjalny mnożnik
    ekspozytory: {           // Ekspozytory - różne mnożniki
      podstawkowy: 2.2,
      schodkowy: 2.5,
      z_haczykami: 2.4,
      wiszacy: 2.2,
      stojak: 2.5,
      kosmetyczny: 2.7
    },
    impuls_kasowy: 1.8       // Impuls kasowy
  };
  
  // Cennik gięcia na gorąco wg grubości (zł/mb)
  export const BENDING_PRICES = {
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
  };
  
  // Stałe pakowania
  export const PACKAGING_CONSTANTS = {
    CARDBOARD_THICKNESS: 10,         // mm
    CARDBOARD_PRICE_PER_M2: 8,       // zł/m²
    PALLET_DIMENSIONS: {
      width: 800,
      length: 1200,
      maxHeight: 1800
    },
    PRICES: {
      unit_box: 35,                  // zł/szt
      collective_box: 35,            // zł/m²
      pallet: {
        under30kg: 200,
        over30kg: 300
      }
    },
    DELIVERY_PRICES: {
      courier: 0,                    // Cena zależna od wagi
      own_delivery_city: 50,
      own_delivery_100km: 200,
      personal_pickup: 0
    }
  };
  
  // Domyślne wartości odpadów
  export const WASTE_DEFAULTS = {
    standard: 0.12,                  // 12% dla standardowych produktów
    small_series: { qty: 5, waste: 50 },  // 50mm dla małych serii
    large_series: { waste: 20 }      // 20mm dla większych serii
  };