// pages/Calculator.tsx
import React from 'react';
import { ProductProvider } from '../contexts/ProductContext';
import { ProductSelector } from '../components/ProductSelector/ProductSelector';
import { ProductOptionsSwitcher } from '../components/ProductOptions/ProductOptionsSwitcher';
import { Results } from '../components/Results/Results';
import { useProduct } from '../contexts/ProductContext';
import styles from './Calculator.module.css';

const CalculatorContent: React.FC = () => {
  const { selectedProductType, setSelectedProductType } = useProduct();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Kalkulator PlexiSystem
          </h1>
          <p className={styles.subtitle}>
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
          <div className={styles.content}>
            {/* Formularz opcji */}
            <div className={styles.optionsSection}>
              <ProductOptionsSwitcher />
            </div>

            {/* Wyniki */}
            <div className={styles.resultsSection}>
              <div className={styles.stickyResults}>
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