// calculators/kasetonCalculator.js

/**
 * Kalkulator dla kasetonów reklamowych
 * Kasetonów nie obejmuje standardowy mnożnik - mają stałe ceny
 */
export function calculateKaseton(params) {
    const { width, height, quantity, kasetonType, letterType } = params;
    
    // Powierzchnia w m²
    const surface = (width * height * quantity) / 1000000;
    
    // Ceny bazowe kasetonów
    const kasetonPrices = {
      kaseton_plexi: 1550,     // zł/m²
      kaseton_dibond: 1400     // zł/m²
    };
    
    // Ceny opcji liter
    const letterPrices = {
      litery_podklejone: 0,    // bez dopłaty
      litery_zlicowane: 150,   // zł/m²
      litery_wystajace: 400,   // zł/m²
      litery_halo: 300         // zł/m²
    };
    
    // Koszt podstawowy (bez mnożnika!)
    const baseCost = surface * (kasetonPrices[kasetonType] || 0);
    
    // Koszt liter (też bez mnożnika!)
    const letterCost = surface * (letterPrices[letterType] || 0);
    
    return {
      surface: surface,
      baseCost: baseCost,
      letterCost: letterCost,
      totalCost: baseCost + letterCost,
      thickness: 3 // Stała grubość 3mm dla kasetonów
    };
  }