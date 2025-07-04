// store/calculatorStore.ts
import { create } from 'zustand';
import { CalculationResult } from '../types/calculator.types';

// Definiujemy osobny interfejs dla wyników kalkulacji
interface CalculatorResults {
  formatka?: CalculationResult;
  kaseton?: CalculationResult;
  ledon?: CalculationResult;
}

interface CalculatorStore extends CalculatorResults {
  currentProduct: string | null;
  setCalculationResult: (product: string, result: CalculationResult) => void;
  setCurrentProduct: (product: string | null) => void;
  getTotalCost: () => number;
  clearResults: () => void;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  formatka: undefined,
  kaseton: undefined,
  ledon: undefined,
  currentProduct: null,

  setCalculationResult: (product: string, result: CalculationResult) => {
    set((state) => ({
      ...state,
      [product]: result
    }));
  },

  setCurrentProduct: (product: string | null) => {
    set({ currentProduct: product });
  },

  getTotalCost: () => {
    const state = get();
    const currentProduct = state.currentProduct;
    if (currentProduct && state[currentProduct as keyof CalculatorResults]) {
      const result = state[currentProduct as keyof CalculatorResults] as CalculationResult;
      return result.totalCost;
    }
    return 0;
  },

  clearResults: () => {
    set({
      formatka: undefined,
      kaseton: undefined,
      ledon: undefined
    });
  }
}));