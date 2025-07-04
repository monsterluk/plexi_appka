// pages/Calculator.tsx
import React from 'react';
import { ProductProvider } from '../contexts/ProductContext';
import { ProductSelector } from '../components/ProductSelector/ProductSelector';
import { ProductOptionsSwitcher } from '../components/ProductOptions/ProductOptionsSwitcher';
import { Results } from '../components/Results/Results';
import { useProduct } from '../contexts/ProductContext';

const CalculatorContent: React.FC = () => {
  const { selectedProductType, setSelectedProductType } = useProduct();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Kalkulator PlexiSystem
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Profesjonalna wycena produktów z plexi
          </p>
        </div>

        {/* Selektor produktów */}
        <ProductSelector
          selectedProduct={selectedProductType}
          onSelectProduct={(productId) => setSelectedProductType(productId as any)}
        />

        {/* Opcje produktu i wyniki */}
        {selectedProductType && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formularz opcji */}
            <div className="lg:col-span-2">
              <ProductOptionsSwitcher />
            </div>

            {/* Wyniki */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Results />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Calculator: React.FC = () => {
  return (
    <ProductProvider>
      <CalculatorContent />
    </ProductProvider>
  );
};