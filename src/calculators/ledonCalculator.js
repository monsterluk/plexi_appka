// calculators/ledonCalculator.js

/**
 * Kalkulator dla LEDON (Neon LED)
 * Specjalna logika z mnożnikiem 5
 */
export function calculateLedon(params) {
    const { width, height, thickness, plexiType, ledType, ledLength, options } = params;
    
    // Powierzchnia rzeczywista w m²
    const surface = (width * height) / 1000000;
    
    // Ceny plexi
    const plexiPrices = {
      plexi_bezbarwna: 30,
      plexi_mleczna: 32,
      plexi_czarna: 35
    };
    
    // Ceny LED
    const ledPrices = {
      led_standard: 30,      // zł/m
      led_neonflex: 70       // zł/m
    };
    
    // Koszt plexi z mnożnikiem LEDON
    const thicknessFactor = thickness / 3; // Normalizacja do 3mm
    const ledonMultiplier = 5;
    const plexiCost = surface * plexiPrices[plexiType] * thicknessFactor * ledonMultiplier;
    
    // Koszt LED
    const ledCost = ledLength * ledPrices[ledType];
    
    // Opcje dodatkowe
    let additionalCost = 0;
    let isWaterproof = false;
    
    if (options.projekt_skomplikowany) additionalCost += 300;
    if (options.rgb) additionalCost += 150;
    if (options.montaz_zasilacz) additionalCost += 150;
    if (options.wodoodpornosc) isWaterproof = true;
    
    // Suma przed wodoodpornością
    let subtotal = plexiCost + ledCost + additionalCost;
    
    // Wodoodporność +20%
    if (isWaterproof) {
      subtotal *= 1.2;
    }
    
    // Oblicz ilość LEDów (10 na metr)
    const ledQuantity = Math.ceil(ledLength * 10);
    
    return {
      surface: surface,
      plexiCost: plexiCost,
      ledCost: ledCost,
      additionalCost: additionalCost,
      totalCost: subtotal,
      ledQuantity: ledQuantity,
      thickness: thickness
    };
  }