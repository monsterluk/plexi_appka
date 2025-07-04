// components/ProductOptions/Ekspozytory/SchodkowyOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { SchodkowyOptions as SchodkowyOptionsType } from '../../../types/ekspozytory.types';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Checkbox } from '../../UI/Checkbox';
import { RadioGroup } from '../../UI/RadioGroup';
import { Slider } from '../../UI/Slider';
import styles from './Options.module.css';

interface Props {
  options: SchodkowyOptionsType;
  onChange: (options: SchodkowyOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const SchodkowyOptions: React.FC<Props> = ({ 
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
        <h4>Opcje ekspozytora schodkowego</h4>
        <p className={styles.description}>
          Wielopoziomowy ekspozytor z półkami ułożonymi kaskadowo. 
          Idealny do prezentacji produktów na różnych wysokościach.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.options}>
          {/* Liczba poziomów */}
          <div className={styles.sliderGroup}>
            <label>Liczba poziomów: {options.levels}</label>
            <Slider
              min={2}
              max={6}
              value={options.levels}
              onChange={(value) => onChange({ ...options, levels: value })}
              marks={[
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
                { value: 6, label: '6' }
              ]}
            />
            <p className={styles.hint}>
              Każdy poziom to osobna półka na różnej wysokości
            </p>
          </div>

          {/* Materiał */}
          <Select
            label="Rodzaj plexi"
            value={options.material}
            onChange={(value) => onChange({ ...options, material: value as any })}
            options={[
              { value: 'bezbarwna', label: 'Bezbarwna (30 zł/m²)' },
              { value: 'mleczna', label: 'Mleczna (+10%)' },
              { value: 'czarna', label: 'Czarna (+10%)' },
              { value: 'biala', label: 'Biała (+10%)' }
            ]}
          />

          {/* Grubość */}
          <Select
            label="Grubość materiału"
            value={options.thickness.toString()}
            onChange={(value) => onChange({ ...options, thickness: parseInt(value) })}
            options={[
              { value: '3', label: '3 mm' },
              { value: '4', label: '4 mm' },
              { value: '5', label: '5 mm' }
            ]}
          />

          {/* Plecy */}
          <Checkbox
            label="Dodaj plecy"
            checked={options.hasBack}
            onChange={(checked) => onChange({ ...options, hasBack: checked })}
            description="Tylna ścianka stabilizująca konstrukcję"
          />

          {/* Grafika */}
          {options.hasBack && (
            <RadioGroup
              label="Grafika na plecach"
              value={options.graphics}
              onChange={(value) => onChange({ ...options, graphics: value as any })}
              options={[
                { value: 'none', label: 'Brak grafiki' },
                { value: 'single', label: 'Jednostronna (75 zł/m²)' },
                { value: 'double', label: 'Dwustronna (150 zł/m²)' }
              ]}
            />
          )}

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

        {/* Wizualizacja schodkowa */}
        <div className={styles.visualization}>
          <svg viewBox="0 0 400 300" width="100%" height="300">
            <g transform="translate(50, 50)">
              {/* Rysuj poziomy */}
              {Array.from({ length: options.levels }, (_, i) => {
                const y = (200 / options.levels) * i;
                const x = (150 / options.levels) * i;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width={200 - x}
                      height={20}
                      fill="var(--color-accent-blue)"
                      opacity={0.8}
                      rx={4}
                    />
                    <text
                      x={x + 10}
                      y={y + 15}
                      fill="white"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Poziom {i + 1}
                    </text>
                  </g>
                );
              })}
              
              {/* Boki */}
              <line x1="0" y1="0" x2="0" y2="200" 
                    stroke="var(--color-accent-orange)" strokeWidth="3" />
              <line x1="200" y1="0" x2="200" y2="200" 
                    stroke="var(--color-accent-orange)" strokeWidth="3" />
              
              {/* Plecy jeśli włączone */}
              {options.hasBack && (
                <rect x="0" y="0" width="200" height="200" 
                      fill="none" stroke="var(--color-accent-orange)" 
                      strokeWidth="2" strokeDasharray="5,5" />
              )}
            </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};