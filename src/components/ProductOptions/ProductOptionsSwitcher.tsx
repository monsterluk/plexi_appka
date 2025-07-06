// src/components/ProductOptions/ProductOptionsSwitcher.tsx
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../../contexts/ProductContext';
import { FormatkaOptions } from './FormatkaOptions';
import { KasetonOptions } from './KasetonOptions';
import { LedonOptions } from './LedonOptions';
import { ContainerOptions } from './ContainerOptions';
import { GablotaOptions } from './GablotaOptions';
import { ObudowaOptions } from './Obudowa/ObudowaOptions';
import { ImpulsKasowyOptions } from './ImpulsKasowy/ImpulsKasowyOptions';
import { EkspozytorOptionsWrapper } from './Ekspozytory/EkspozytorOptionsWrapper';
import styles from './ProductOptionsSwitcher.module.css';

export const ProductOptionsSwitcher: React.FC = () => {
  const { selectedProductType, updateProductOptions, productOptions } = useProduct();

  const handleOptionsChange = useCallback((options: any) => {
    if (selectedProductType) {
      updateProductOptions(selectedProductType, options);
    }
  }, [selectedProductType, updateProductOptions]);

  const renderOptions = () => {
    if (!selectedProductType) {
      return (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
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
      case 'kaseton':
        return (
          <KasetonOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.kaseton}
          />
        );
      case 'ledon':
        return (
          <LedonOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.ledon}
          />
        );
      case 'pojemnik':
        return (
          <ContainerOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.pojemnik}
          />
        );
      case 'gablota':
        return (
          <GablotaOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.gablota}
          />
        );
      case 'obudowa':
        return (
          <ObudowaOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.obudowa}
          />
        );
      case 'impuls_kasowy':
        return (
          <ImpulsKasowyOptions
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.impuls_kasowy}
          />
        );
      case 'ekspozytory':
        return (
          <EkspozytorOptionsWrapper
            onOptionsChange={handleOptionsChange}
            initialOptions={productOptions.ekspozytory}
          />
        );
      default:
        return (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Opcje dla tego produktu są w przygotowaniu...
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
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