// components/ProductOptions/Ekspozytory/EkspozytorOptionsWrapper.tsx

import React, { useState, useEffect } from 'react';
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
  onOptionsChange: (options: EkspozytorOptions) => void;
  initialOptions?: Partial<EkspozytorOptions>;
}

export const EkspozytorOptionsWrapper: React.FC<Props> = ({ 
  onOptionsChange,
  initialOptions
}) => {
  // Domyślne wymiary
  const defaultDimensions = { width: 400, height: 500, depth: 300 };
  
  const [options, setOptions] = useState<EkspozytorOptions | null>(
    initialOptions ? (initialOptions as EkspozytorOptions) : null
  );
  const [dimensions] = useState(defaultDimensions);

  useEffect(() => {
    if (options) {
      onOptionsChange(options);
    }
  }, [options]); // Celowo pomijamy onOptionsChange

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
    let newOptions: EkspozytorOptions;
    
    switch (subtype) {
      case 'podstawkowy':
        newOptions = {
          ...baseOptions,
          subtype: 'podstawkowy',
          hasSides: false,
          hasLaczniki: true
        };
        break;
      
      case 'schodkowy':
        newOptions = {
          ...baseOptions,
          subtype: 'schodkowy',
          levels: 3,
          hasBack: true
        };
        break;
      
      case 'z_haczykami':
        newOptions = {
          ...baseOptions,
          subtype: 'z_haczykami',
          hooksCount: 10,
          hasBase: false,
          hasSides: false
        };
        break;
      
      case 'wiszacy':
        newOptions = {
          ...baseOptions,
          subtype: 'wiszacy',
          shelvesCount: 3,
          shelfDepth: 100,
          hasSides: false,
          mountingType: 'hooks'
        };
        break;
      
      case 'stojak':
        newOptions = {
          ...baseOptions,
          subtype: 'stojak',
          shelvesCount: 0,
          shelfDepth: 150,
          hasSides: true
        };
        break;
      
      case 'kosmetyczny':
        newOptions = {
          ...baseOptions,
          subtype: 'kosmetyczny',
          hasSecondBottom: false,
          shelvesWithHoles: 2,
          holesPerShelf: 6,
          hasTopper: false,
          hasDividers: false
        };
        break;
      
      default:
        return;
    }
    
    setOptions(newOptions);
  };

  const handleOptionsChange = (newOptions: EkspozytorOptions) => {
    setOptions(newOptions);
  };

  const renderOptions = () => {
    if (!options) return null;

    switch (options.subtype) {
      case 'podstawkowy':
        return (
          <PodstawkowyOptions 
            options={options} 
            onChange={handleOptionsChange}
            dimensions={dimensions}
          />
        );
      
      case 'schodkowy':
        return (
          <SchodkowyOptions 
            options={options} 
            onChange={handleOptionsChange}
            dimensions={dimensions}
          />
        );
      
      case 'z_haczykami':
        return (
          <ZHaczykamiOptions 
            options={options} 
            onChange={handleOptionsChange}
            dimensions={dimensions}
          />
        );
      
      case 'wiszacy':
        return (
          <WiszacyOptions 
            options={options} 
            onChange={handleOptionsChange}
            dimensions={dimensions}
          />
        );
      
      case 'stojak':
        return (
          <StojakOptions 
            options={options} 
            onChange={handleOptionsChange}
            dimensions={dimensions}
          />
        );
      
      case 'kosmetyczny':
        return (
          <KosmetycznyOptions 
            options={options} 
            onChange={handleOptionsChange}
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