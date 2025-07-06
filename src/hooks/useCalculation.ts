// src/hooks/useCalculation.ts
import { useEffect, useRef, useCallback } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import { CalculationResult } from '../types/calculator.types';

export function useCalculation<T>(
  productType: string,
  options: T,
  calculateFn: (options: T) => CalculationResult,
  debounceMs: number = 300
) {
  const { setCalculationResult } = useCalculatorStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculate = useCallback(() => {
    try {
      const result = calculateFn(options);
      setCalculationResult(productType, result);
    } catch (error) {
      console.error(`Error calculating ${productType}:`, error);
    }
  }, [options, productType, calculateFn, setCalculationResult]);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(calculate, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [calculate, debounceMs]);
}