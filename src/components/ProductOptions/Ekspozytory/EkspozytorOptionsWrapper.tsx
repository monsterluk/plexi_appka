// components/ProductOptions/Ekspozytory/EkspozytorOptionsWrapper.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EkspozytorOptions, EkspozytorSubtype } from '../../../types/ekspozytory.types';
import { PodstawkowyOptions } from './PodstawkowyOptions';
import { SchodkowyOptions } from './SchodkowyOptions';
import { ZHaczykamiOptions } from './ZHaczykamiOptions';
import { WiszacyOptions } from './WiszacyOptions';
import { StojakOptions } from './StojakOptions';
import { KosmetycznyOptions } from './KosmetycznyOptions';
import { EkspozytorSelector } from './EkspozytorSelector';
import styles from './EkspozytorOptionsWrapper.module.css';

interface Props {
  options: EkspozytorOptions | null;
  onChange: (options: EkspozytorOptions) => void;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export const EkspozytorOptionsWrapper: React.FC<Props> = ({ 
  options, 
  onChange,
  dimensions 
}) => {
  const handleSubtypeChange = (subtype: EkspozytorSubtype) => {
    // Resetuj opcje przy zmianie typu
    const baseOptions = {
      subtype,
      material: 'bezbarwna' as const,
      thickness: 3,
      graphics: 'none' as const,
      quantity: 1
    };

    // Ustaw domyślne wartości dla każdego typu
    switch (subtype) {
      case 'podstawkowy':
        onChange({
          ...baseOptions,
          subtype: 'podstawkowy',
          hasSides: false,
          hasLaczniki: true
        });
        break;
      
      case 'schodkowy':
        onChange({
          ...baseOptions,
          subtype: 'schodkowy',
          levels: 3,
          hasBack: true
        });
        break;
      
      case 'z_haczykami':
        onChange({
          ...baseOptions,
          subtype: 'z_haczykami',
          hooksCount: 10,
          hasBase: false,
          hasSides: false
        });
        break;
      
      case 'wiszacy':
        onChange({
          ...baseOptions,
          subtype: 'wiszacy',
          shelvesCount: 3,
          shelfDepth: 100,
          hasSides: false,
          mountingType: 'hooks'
        });
        break;
      
      case 'stojak':
        onChange({
          ...baseOptions,
          subtype: 'stojak',
          shelvesCount: 0,
          shelfDepth: 150,
          hasSides: true
        });
        break;
      
      case 'kosmetyczny':
        onChange({
          ...baseOptions,
          subtype: 'kosmetyczny',
          hasSecondBottom: false,
          shelvesWithHoles: 2,
          holesPerShelf: 6,
          hasTopper: false,
          hasDividers: false
        });
        break;
    }
  };

  const renderOptions = () => {
    if (!options) return null;

    switch (options.subtype) {
      case 'podstawkowy':
        return (
          <PodstawkowyOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      case 'schodkowy':
        return (
          <SchodkowyOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      case 'z_haczykami':
        return (
          <ZHaczykamiOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      case 'wiszacy':
        return (
          <WiszacyOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      case 'stojak':
        return (
          <StojakOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      case 'kosmetyczny':
        return (
          <KosmetycznyOptions 
            options={options} 
            onChange={onChange}
            dimensions={dimensions}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <EkspozytorSelector 
        selectedType={options?.subtype || null}
        onSelect={handleSubtypeChange}
      />
      
      <AnimatePresence mode="wait">
        {options && (
          <motion.div
            key={options.subtype}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.optionsContainer}
          >
            {renderOptions()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};