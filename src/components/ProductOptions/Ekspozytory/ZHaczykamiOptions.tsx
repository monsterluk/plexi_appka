// components/ProductOptions/Ekspozytory/ZHaczykamiOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ZHaczykamiOptions as ZHaczykamiOptionsType } from '../../../types/ekspozytory.types';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Checkbox } from '../../UI/Checkbox';
import { RadioGroup } from '../../UI/RadioGroup';
import { Info } from 'lucide-react';
import styles from './Options.module.css';

interface Props {
  options: ZHaczykamiOptionsType;
  onChange: (options: ZHaczykamiOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const ZHaczykamiOptions: React.FC<Props> = ({ 
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
        <h4>Opcje ekspozytora z haczykami</h4>
        <p className={styles.description}>
          Płyta tylna z otworami na haczyki do zawieszania produktów. 
          Opcjonalnie z podstawą i bokami.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.options}>
          {/* Liczba haczyków */}
          <Input
            label="Liczba haczyków"
            type="number"
            min="1"
            max="100"
            value={options.hooksCount.toString()}
            onChange={(e) => onChange({ 
              ...options, 
              hooksCount: parseInt(e.target.value) || 1 
            })}
            tooltip="Haczyki metalowe lub plastikowe (2 zł/szt)"
            icon={<Info size={16} />}
          />

          {/* Podstawa */}
          <Checkbox
            label="Dodaj podstawę"
            checked={options.hasBase}
            onChange={(checked) => onChange({ ...options, hasBase: checked })}
            description="Płaska płyta pod spodem dla stabilności"
          />

          {/* Głębokość podstawy */}
          {options.hasBase && (
            <Input
              label="Głębokość podstawy (mm)"
              type="number"
              min="50"
              max="500"
              value={options.baseDepth?.toString() || '200'}
              onChange={(e) => onChange({ 
                ...options, 
                baseDepth: parseInt(e.target.value) || 200 
              })}
            />
          )}

          {/* Boki */}
          <Checkbox
            label="Dodaj boki"
            checked={options.hasSides}
            onChange={(checked) => onChange({ ...options, hasSides: checked })}
            description="Ścianki boczne zwiększające stabilność"
          />

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

          {/* Grafika */}
          <RadioGroup
            label="Grafika na płycie tylnej"
            value={options.graphics}
            onChange={(value) => onChange({ ...options, graphics: value as any })}
            options={[
              { value: 'none', label: 'Brak grafiki' },
              { value: 'single', label: 'Jednostronna (75 zł/m²)' },
              { value: 'double', label: 'Dwustronna (150 zł/m²)' }
            ]}
          />
        </div>

        {/* Wizualizacja */}
        <div className={styles.visualization}>
          <div className={styles.vizHeader}>
            <h5>Rozmieszczenie haczyków</h5>
            <p>{options.hooksCount} haczyków</p>
          </div>
          
          <svg viewBox="0 0 300 400" width="100%" height="400">
            <g transform="translate(50, 50)">
              {/* Płyta tylna */}
              <rect x="0" y="0" width="200" height="300" 
                    fill="var(--color-bg-tertiary)" 
                    stroke="var(--color-accent-blue)" 
                    strokeWidth="2" rx={8} />
              
              {/* Haczyki */}
              {Array.from({ length: Math.min(options.hooksCount, 20) }, (_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const x = 30 + col * 45;
                const y = 30 + row * 50;
                
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="var(--color-accent-orange)" />
                    <path d={`M ${x} ${y} L ${x} ${y + 15} L ${x + 10} ${y + 15}`}
                          stroke="var(--color-accent-orange)" 
                          strokeWidth="2" 
                          fill="none"
                          strokeLinecap="round" />
                  </g>
                );
              })}
              
              {/* Podstawa */}
              {options.hasBase && (
                <rect x="0" y="300" width="200" height="20" 
                      fill="var(--color-accent-blue)" 
                      opacity={0.6} rx={4} />
              )}
              
              {/* Boki */}
              {options.hasSides && (
                <>
                  <rect x="-20" y="0" width="20" height="300" 
                        fill="var(--color-accent-blue)" 
                        opacity={0.6} rx={4} />
                  <rect x="200" y="0" width="20" height="300" 
                        fill="var(--color-accent-blue)" 
                        opacity={0.6} rx={4} />
                </>
              )}
            </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};