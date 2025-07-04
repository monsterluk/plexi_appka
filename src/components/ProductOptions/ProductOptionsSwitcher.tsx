// src/components/ProductOptions/ProductOptionsSwitcher.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../../contexts/ProductContext';
import { FormatkaOptions } from './FormatkaOptions';
// import { KasetonOptions } from './KasetonOptions';
// import { LedonOptions } from './LedonOptions';

export const ProductOptionsSwitcher: React.FC = () => {
  const { selectedProductType, updateProductOptions, productOptions } = useProduct();

  const handleOptionsChange = (options: any) => {
    if (selectedProductType) {
      updateProductOptions(selectedProductType, options);
    }
  };

  const renderOptions = () => {
    if (!selectedProductType) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Wybierz typ produktu, aby skonfigurować opcje
          </p>
        </div>
      );
    }

    switch (selectedProductType) {
      case 'formatka':
        return (
          <FormatkaOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.formatka}
          />
        );
      // Dodaj pozostałe produkty gdy będą gotowe
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Opcje dla tego produktu są w przygotowaniu...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProductType || 'empty'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderOptions()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};