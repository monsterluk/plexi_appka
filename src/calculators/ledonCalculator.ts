// calculators/ledonCalculator.ts
import { LedonOptions } from '../types/product.types';
import { CalculationResult } from '../types/calculator.types';

const PLEXI_PRICES = {
  clear: 30,
  milky: 32,
  black: 35
};

const LED_PRICES = {
  white: 30,
  warm: 30,
  rgb: 60,
  custom: 80
};

const LEDON_MULTIPLIER = 5;

export function calculateLedon(options: LedonOptions): CalculationResult {
  // Powierzchnia w m²
  const surface = (options.width * options.height * options.quantity) / 1_000_000;
  
  // Koszt plexi z mnożnikiem LEDON
  const plexiCost = surface * PLEXI_PRICES[options.plexiType as keyof typeof PLEXI_PRICES] * 3 * LEDON_MULTIPLIER; // 3mm grubość
  
  // Szacowana długość LED na podstawie tekstu
  const estimatedLedLength = options.text.length * 0.15; // ~15cm na znak
  const ledColor = options.lighting?.color || 'white';
  const ledCost = estimatedLedLength * (LED_PRICES[ledColor as keyof typeof LED_PRICES] || LED_PRICES.white);
  
  // Koszty dodatkowe
  let additionalCost = 0;
  const breakdown: { [key: string]: number } = {};
  
  if (options.features?.waterproof) {
    additionalCost += (plexiCost + ledCost) * 0.2; // +20%
    breakdown.waterproof = (plexiCost + ledCost) * 0.2;
  }
  
  if (options.features?.dimmer) {
    additionalCost += 150;
    breakdown.dimmer = 150;
  }
  
  if (options.features?.remoteControl) {
    additionalCost += 200;
    breakdown.remoteControl = 200;
  }
  
  // Montaż
  const mountingType = options.features?.mounting || 'wall';
  const mountingCost = mountingType === 'wall' ? 100 : 
                      mountingType === 'hanging' ? 150 : 200;
  additionalCost += mountingCost;
  breakdown.mounting = mountingCost;
  
  // Projekt skomplikowany
  if (options.fontStyle === 'custom') {
    additionalCost += 300;
    breakdown.customDesign = 300;
  }
  
  // Waga (bardzo lekki produkt)
  const weight = surface * 3 * 1.19 + estimatedLedLength * 0.05; // plexi + LED
  
  const materialCost = plexiCost;
  const addonsCost = ledCost + additionalCost;
  
  return {
    surface: surface * options.quantity,
    weight: weight * options.quantity,
    materialCost: materialCost * options.quantity,
    addonsCost: addonsCost * options.quantity,
    totalCost: (materialCost + addonsCost) * options.quantity,
    breakdown: {
      plexi: plexiCost * options.quantity,
      led: ledCost * options.quantity,
      ...breakdown
    }
  };
}