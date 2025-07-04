// components/ProductOptions/Ekspozytory/PodstawkowyOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { PodstawkowyOptions as PodstawkowyOptionsType } from '../../../types/ekspozytory.types';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Checkbox } from '../../UI/Checkbox';
import { RadioGroup } from '../../UI/RadioGroup';
import { Visualization3D } from './Visualizations/PodstawkowyViz';
import styles from './Options.module.css';

interface Props {
  options: PodstawkowyOptionsType;
  onChange: (options: PodstawkowyOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const PodstawkowyOptions: React.FC<Props> = ({ 
  options, 
  onChange,
  dimensions 
}) => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.header}>
        <h4>Opcje ekspozytora podstawkowego</h4>
        <p className={styles.description}>
          Ekspozytor składa się z podstawy i pionowej ścianki tylnej. 
          Opcjonalnie może mieć boki dla zwiększenia stabilności.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Wizualizacja */}
        <div className={styles.visualization}>
          <Visualization3D 
            dimensions={dimensions}
            options={options}
          />
        </div>

        {/* Opcje */}
        <div className={styles.options}>
          {/* Materiał */}
          <Select
            label="Rodzaj plexi"
            value={options.material}
            onChange={(value) => onChange({ ...options, material: value as any })}
            tooltip="Wybierz rodzaj materiału dla ekspozytora"
            options={[
              { value: 'bezbarwna', label: 'Bezbarwna (30 zł/m²)' },
              { value: 'mleczna', label: 'Mleczna (+10%)' },
              { value: 'czarna', label: 'Czarna (+10%)' },
              { value: 'biala', label: 'Biała (+10%)' },
              { value: 'kolorowa_3mm', label: 'Kolorowa 3mm (120 zł/m²)' },
              { value: 'kolorowa_5mm', label: 'Kolorowa 5mm (200 zł/m²)' }
            ]}
          />

          {/* Grubość */}
          <Select
            label="Grubość materiału"
            value={options.thickness.toString()}
            onChange={(value) => onChange({ ...options, thickness: parseInt(value) })}
            tooltip="Standardowa grubość to 3mm"
            options={[
              { value: '2', label: '2 mm' },
              { value: '3', label: '3 mm' },
              { value: '4', label: '4 mm' },
              { value: '5', label: '5 mm' }
            ]}
          />

          {/* Boki */}
          <Checkbox
            label="Dodaj boki"
            checked={options.hasSides}
            onChange={(checked) => onChange({ ...options, hasSides: checked })}
            description="Ścianki boczne zwiększają stabilność"
          />

          {/* Łączniki */}
          <Checkbox
            label="Łączniki"
            checked={options.hasLaczniki}
            onChange={(checked) => onChange({ ...options, hasLaczniki: checked })}
            description="Kątowniki lub klej łączący elementy"
          />

          {/* Grafika */}
          <RadioGroup
            label="Grafika na ściance tylnej"
            value={options.graphics}
            onChange={(value) => onChange({ ...options, graphics: value as any })}
            options={[
              { value: 'none', label: 'Brak grafiki' },
              { value: 'single', label: 'Jednostronna (75 zł/m²)' },
              { value: 'double', label: 'Dwustronna (150 zł/m²)' }
            ]}
          />

          {/* Ilość */}
          <Input
            label="Ilość sztuk"
            type="number"
            min="1"
            value={options.quantity.toString()}
            onChange={(e) => onChange({ 
              ...options, 
              quantity: parseInt(e.target.value) || 1 
            })}
          />
        </div>
      </div>
    </motion.div>
  );
};