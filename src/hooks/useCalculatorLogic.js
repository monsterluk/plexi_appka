// hooks/useCalculatorLogic.js

import { useState, useCallback, useMemo } from 'react';
import { 
  PROFIT_MULTIPLIERS, 
  BENDING_PRICES,
  PACKAGING_CONSTANTS,
  WASTE_DEFAULTS
} from '../constants/calculator';
import {
  calculateSurfaceArea,
  calculateWeight,
  calculateEdgeLength,
  calculateWaste,
  calculateCartonSurface,
  calculateProductsPerPallet
} from '../utils/calculatorUtils';
import { materials, addons } from '../data/materials';

/**
 * Hook główny kalkulatora
 * Zawiera całą logikę obliczeniową
 */
export function useCalculatorLogic() {
  // Stan główny
  const [formData, setFormData] = useState({
    productType: '',
    material: null,
    thickness: 0,
    width: 0,
    height: 0,
    depth: 0,
    quantity: 1,
    // Dodatki
    addons: {},
    options: {},
    // Przegrody dla pojemników
    partitions: {
      enabled: false,
      count: 0,
      direction: 'width' // 'width' lub 'height'
    },
    // Dno dla gablot
    customBase: {
      enabled: false,
      material: null,
      thickness: 0
    }
  });

  /**
   * Oblicza koszty materiału podstawowego
   */
  const calculateMaterialCost = useCallback(() => {
    const { productType, material, thickness, width, height, depth, quantity } = formData;
    
    if (!material || !thickness || !width || !height || !quantity) {
      return { cost: 0, surface: 0, weight: 0, waste: 0 };
    }
    
    // Oblicz odpad dla płyt standardowych
    let finalWidth = width;
    let finalHeight = height;
    let waste = 0;
    
    if (productType === 'plyta') {
      waste = calculateWaste(quantity);
      finalWidth = width + waste;
      finalHeight = height + waste;
    }
    
    // Oblicz powierzchnię
    const surfaceArea = calculateSurfaceArea(
      productType, 
      finalWidth, 
      finalHeight, 
      depth, 
      quantity
    );
    
    // Podstawowy koszt materiału
    // Poprawka: cena_za_m2 × grubość × powierzchnia (bez współczynnika trudności)
    let materialCost = material.cena_za_m2 * thickness * surfaceArea;
    
    // Zastosuj mnożnik zysku (tylko dla materiału, nie dla dodatków!)
    const multiplier = getProductMultiplier(productType);
    materialCost *= multiplier;
    
    // Oblicz wagę
    const weight = calculateWeight(surfaceArea, thickness, material.nazwa);
    
    return {
      cost: materialCost,
      surface: surfaceArea,
      weight: weight,
      waste: waste
    };
  }, [formData]);

  /**
   * Oblicza koszty przegród
   */
  const calculatePartitionsCost = useCallback(() => {
    const { productType, material, thickness, width, height, depth, partitions } = formData;
    
    if (!partitions.enabled || partitions.count === 0 || productType !== 'pojemnik') {
      return { cost: 0, surface: 0, length: 0 };
    }
    
    let partitionSurface = 0;
    let totalLength = 0;
    
    if (partitions.direction === 'width') {
      // Przegrody wzdłuż szerokości (wysokość × głębokość)
      partitionSurface = (height * depth * partitions.count) / 1000000;
      totalLength = partitions.count * height / 1000; // w metrach
    } else {
      // Przegrody wzdłuż wysokości (szerokość × głębokość)
      partitionSurface = (width * depth * partitions.count) / 1000000;
      totalLength = partitions.count * width / 1000;
    }
    
    // Dla kratownicy - dodaj przegrody w drugim kierunku
    if (formData.options.partition_type === 'kratownica') {
      if (partitions.direction === 'width') {
        partitionSurface += (width * depth * partitions.count) / 1000000;
        totalLength += partitions.count * width / 1000;
      } else {
        partitionSurface += (height * depth * partitions.count) / 1000000;
        totalLength += partitions.count * height / 1000;
      }
    }
    
    // Koszt: powierzchnia × cena materiału × grubość × mnożnik
    const cost = partitionSurface * material.cena_za_m2 * thickness * PROFIT_MULTIPLIERS.pojemnik;
    
    return {
      cost: cost,
      surface: partitionSurface,
      length: totalLength
    };
  }, [formData]);

  /**
   * Oblicza koszty dna dla gablot
   */
  const calculateCustomBaseCost = useCallback(() => {
    const { productType, width, height, quantity, customBase } = formData;
    
    if (!customBase.enabled || productType !== 'gablota' || !customBase.material) {
      return { cost: 0, surface: 0 };
    }
    
    // Powierzchnia dna
    const baseSurface = (width * height * quantity) / 1000000;
    
    // Koszt dna z innego materiału
    const cost = baseSurface * 
                 customBase.material.cena_za_m2 * 
                 customBase.thickness * 
                 PROFIT_MULTIPLIERS.gablota;
    
    return {
      cost: cost,
      surface: baseSurface
    };
  }, [formData]);

  /**
   * Oblicza koszty dodatków
   */
  const calculateAddonsCost = useCallback(() => {
    const { addons: selectedAddons, thickness, quantity, productType, width, height, depth } = formData;
    
    let totalCost = 0;
    const details = [];
    
    Object.entries(selectedAddons).forEach(([addonId, addonData]) => {
      if (!addonData.enabled || !addonData.quantity) return;
      
      const addon = addons.find(a => a.id === parseInt(addonId));
      if (!addon) return;
      
      let cost = 0;
      
      // Specjalna logika dla różnych dodatków
      switch(addon.nazwa) {
        case 'Wiercenie otworów':
          // Koszt: cena × liczba otworów × ilość sztuk
          cost = addon.cena * addonData.quantity * quantity;
          break;
          
        case 'Polerowanie krawędzi':
        case 'Fazowanie krawędzi':
          // Poprawka: prawidłowe obliczanie długości krawędzi
          const edgeLength = calculateEdgeLength(productType, width, height, depth);
          cost = addon.cena * edgeLength * quantity;
          
          // Minimalna cena
          if (addon.minPrice && cost < addon.minPrice) {
            cost = addon.minPrice;
          }
          break;
          
        case 'Gięcie na gorąco':
          // Cena zależna od grubości
          const bendingPrice = BENDING_PRICES[thickness] || 0;
          cost = bendingPrice * addonData.quantity;
          break;
          
        default:
          // Standardowe dodatki
          cost = addon.cena * addonData.quantity;
      }
      
      // Dodatki NIE są objęte mnożnikiem zysku!
      totalCost += cost;
      
      details.push({
        name: addon.nazwa,
        quantity: addonData.quantity,
        unit: addon.jednostka,
        unitPrice: addon.cena,
        totalPrice: cost
      });
    });
    
    return {
      cost: totalCost,
      details: details
    };
  }, [formData]);

  /**
   * Oblicza koszty pakowania
   */
  const calculatePackagingCost = useCallback(() => {
    const { width, height, depth, thickness, quantity, packaging } = formData;
    const totalWeight = calculateMaterialCost().weight;
    
    if (!packaging || !packaging.type) {
      return { cost: 0, boxCount: 0, palletCount: 0 };
    }
    
    let packagingCost = 0;
    let boxCount = 0;
    let palletCount = 0;
    
    // Dodaj grubość kartonu do wymiarów
    const boxWidth = width + 2 * PACKAGING_CONSTANTS.CARDBOARD_THICKNESS;
    const boxHeight = height + 2 * PACKAGING_CONSTANTS.CARDBOARD_THICKNESS;
    const boxDepth = (depth || thickness) + 2 * PACKAGING_CONSTANTS.CARDBOARD_THICKNESS;
    
    switch (packaging.type) {
      case 'unit_box':
        boxCount = quantity;
        packagingCost = PACKAGING_CONSTANTS.PRICES.unit_box * quantity;
        break;
        
      case 'collective_box':
        // Oblicz powierzchnię kartonu zbiorczego
        const boxSurfaceM2 = 2 * (
          (boxWidth * boxHeight) / 1000000 +
          (boxWidth * boxDepth) / 1000000 +
          (boxHeight * boxDepth) / 1000000
        );
        boxCount = 1;
        packagingCost = PACKAGING_CONSTANTS.PRICES.collective_box * boxSurfaceM2;
        break;
        
      case 'pallet':
        // Oblicz ilość produktów na palecie
        const productsPerPallet = calculateProductsPerPallet(
          { width: boxWidth, height: boxHeight, depth: boxDepth },
          PACKAGING_CONSTANTS.PALLET_DIMENSIONS
        );
        
        palletCount = Math.ceil(quantity / productsPerPallet);
        
        // Cena w zależności od wagi
        const weightPerPallet = totalWeight / palletCount;
        if (weightPerPallet <= 30) {
          packagingCost = PACKAGING_CONSTANTS.PRICES.pallet.under30kg * palletCount;
        } else {
          packagingCost = PACKAGING_CONSTANTS.PRICES.pallet.over30kg * palletCount;
        }
        break;
    }
    
    // Dodaj koszt kartonu jednostkowego jeśli włączony
    if (packaging.unitCarton) {
      const cartonSurface = calculateCartonSurface(width, height, depth || thickness);
      const cartonCost = cartonSurface * PACKAGING_CONSTANTS.CARDBOARD_PRICE_PER_M2 * quantity;
      packagingCost += cartonCost;
    }
    
    return {
      cost: packagingCost,
      boxCount: boxCount,
      palletCount: palletCount
    };
  }, [formData, calculateMaterialCost]);

  /**
   * Oblicza koszty dostawy
   */
  const calculateDeliveryCost = useCallback(() => {
    const { delivery } = formData;
    const totalWeight = calculateMaterialCost().weight;
    
    if (!delivery || !delivery.type) {
      return { cost: 0 };
    }
    
    let deliveryCost = 0;
    
    switch (delivery.type) {
      case 'courier':
        // Cena kuriera w zależności od wagi
        if (totalWeight <= 20) {
          deliveryCost = 25;
        } else if (totalWeight <= 60) {
          deliveryCost = 40;
        } else {
          deliveryCost = 200; // Paleta
        }
        break;
        
      case 'own_delivery_city':
        deliveryCost = PACKAGING_CONSTANTS.DELIVERY_PRICES.own_delivery_city;
        break;
        
      case 'own_delivery_100km':
        deliveryCost = PACKAGING_CONSTANTS.DELIVERY_PRICES.own_delivery_100km;
        break;
        
      case 'personal_pickup':
        deliveryCost = 0;
        break;
    }
    
    return { cost: deliveryCost };
  }, [formData, calculateMaterialCost]);

  /**
   * Oblicza podsumowanie wszystkich kosztów
   */
  const calculateTotalCost = useCallback(() => {
    const material = calculateMaterialCost();
    const partitions = calculatePartitionsCost();
    const customBase = calculateCustomBaseCost();
    const addons = calculateAddonsCost();
    const packaging = calculatePackagingCost();
    const delivery = calculateDeliveryCost();
    
    const productCost = material.cost + partitions.cost + customBase.cost + addons.cost;
    const logisticsCost = packaging.cost + delivery.cost;
    const totalNetto = productCost + logisticsCost;
    const totalBrutto = totalNetto * 1.23; // VAT 23%
    
    return {
      material: material,
      partitions: partitions,
      customBase: customBase,
      addons: addons,
      packaging: packaging,
      delivery: delivery,
      productCost: productCost,
      logisticsCost: logisticsCost,
      totalNetto: totalNetto,
      totalBrutto: totalBrutto,
      vat: totalNetto * 0.23
    };
  }, [
    calculateMaterialCost,
    calculatePartitionsCost,
    calculateCustomBaseCost,
    calculateAddonsCost,
    calculatePackagingCost,
    calculateDeliveryCost
  ]);

  /**
   * Pobiera mnożnik dla danego typu produktu
   */
  function getProductMultiplier(productType) {
    if (typeof PROFIT_MULTIPLIERS[productType] === 'object') {
      // Dla ekspozytorów - zależy od podtypu
      const subtype = formData.options.ekspozytor_type || 'podstawkowy';
      return PROFIT_MULTIPLIERS[productType][subtype] || 2.5;
    }
    return PROFIT_MULTIPLIERS[productType] || 1.0;
  }

  /**
   * Aktualizuje dane formularza
   */
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Resetuje kalkulator
   */
  const resetCalculator = useCallback(() => {
    setFormData({
      productType: '',
      material: null,
      thickness: 0,
      width: 0,
      height: 0,
      depth: 0,
      quantity: 1,
      addons: {},
      options: {},
      partitions: {
        enabled: false,
        count: 0,
        direction: 'width'
      },
      customBase: {
        enabled: false,
        material: null,
        thickness: 0
      }
    });
  }, []);

  // Wyniki kalkulacji (memoizowane dla wydajności)
  const results = useMemo(() => calculateTotalCost(), [calculateTotalCost]);

  return {
    // Stan
    formData,
    materials,
    addons,
    
    // Metody
    updateFormData,
    resetCalculator,
    
    // Wyniki
    results,
    
    // Funkcje pomocnicze (jeśli potrzebne w komponencie)
    calculateEdgeLength,
    calculateCartonSurface
  };
}



// W hooks/useCalculatorLogic.ts dodaj:

case 'impuls_kasowy':
  const impulsResult = calculateImpulsKasowy(
    dimensions,
    state.impulsOptions!,
    state.quantity
  );
  
  const impulsAddons = getImpulsAddons(
    state.impulsOptions!,
    dimensions,
    state.quantity
  );
  
  return {
    components: impulsResult.components,
    totalMaterial: {
      surface: impulsResult.totalSurface,
      weight: impulsResult.totalWeight,
      cost: impulsResult.totalCost,
      wastePercentage: 0.05
    },
    addons: impulsAddons,
    summary: {
      productCost: impulsResult.materialCost + impulsResult.bendingCost,
      logisticsCost: 0, // do obliczenia osobno
      totalNetto: impulsResult.totalCost,
      vat: impulsResult.totalCost * 0.23,
      totalBrutto: impulsResult.totalCost * 1.23
    }
  };