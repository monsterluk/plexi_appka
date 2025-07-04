// components/ProductOptions/Ekspozytory/KosmetycznyOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { KosmetycznyOptions as KosmetycznyOptionsType } from '../../../types/ekspozytory.types';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { Checkbox } from '../../UI/Checkbox';
import { RadioGroup } from '../../UI/RadioGroup';
import { Slider } from '../../UI/Slider';
import { Sparkles, Info } from 'lucide-react';
import styles from './Options.module.css';

interface Props {
  options: KosmetycznyOptionsType;
  onChange: (options: KosmetycznyOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const KosmetycznyOptions: React.FC<Props> = ({ 
  options, 
  onChange,
  dimensions 
}) => {
  const holeSize = Math.floor(dimensions.width / (options.holesPerShelf + 1));
  
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.header}>
        <h4>Opcje ekspozytora kosmetycznego</h4>
        <p className={styles.description}>
          Zaawansowany ekspozytor z otworami na produkty, opcjonalnym topperem 
          i możliwością dodania przegródek.
        </p>
      </div>

      <div className={styles.advanced}>
        {/* Drugie dno */}
        <div className={styles.optionCard}>
          <Checkbox
            label="Drugie dno"
            checked={options.hasSecondBottom}
            onChange={(checked) => onChange({ ...options, hasSecondBottom: checked })}
            description="Dodatkowy poziom ekspozycji"
          />
        </div>

        {/* Półki z otworami */}
        <div className={styles.optionCard}>
          <h5>Półki z otworami</h5>
          
          <Input
            label="Liczba półek"
            type="number"
            min="1"
            max="5"
            value={options.shelvesWithHoles.toString()}
            onChange={(e) => onChange({ 
              ...options, 
              shelvesWithHoles: parseInt(e.target.value) || 1 
            })}
          />
          
          <div className={styles.sliderGroup}>
            <label>Otworów na półkę: {options.holesPerShelf}</label>
            <Slider
              min={2}
              max={12}
              value={options.holesPerShelf}
              onChange={(value) => onChange({ ...options, holesPerShelf: value })}
            />
            <p className={styles.hint}>
              Średnica otworu: ~{holeSize}mm
            </p>
          </div>
        </div>

        {/* Topper */}
        <div className={styles.optionCard}>
          <Checkbox
            label="Dodaj topper"
            checked={options.hasTopper}
            onChange={(checked) => onChange({ ...options, hasTopper: checked })}
            description="Dekoracyjna płyta na górze ekspozytora"
            icon={<Sparkles size={16} />}
          />
          
          {options.hasTopper && (
            <>
              <Input
                label="Wysokość toppera (mm)"
                type="number"
                min="50"
                max="300"
                value={options.topperHeight?.toString() || '150'}
                onChange={(e) => onChange({ 
                  ...options, 
                  topperHeight: parseInt(e.target.value) || 150 
                })}
              />
              
              <RadioGroup
                label="Grafika na topperze"
                value={options.topperGraphics || 'none'}
                onChange={(value) => onChange({ 
                  ...options, 
                  topperGraphics: value as any 
                })}
                options={[
                  { value: 'none', label: 'Brak' },
                  { value: 'single', label: 'Jednostronna (+75 zł/m²)' },
                  { value: 'double', label: 'Dwustronna (+150 zł/m²)' }
                ]}
              />
            </>
          )}
        </div>

        {/* Przegrody */}
        <div className={styles.optionCard}>
          <Checkbox
            label="Dodaj przegrody"
            checked={options.hasDividers}
            onChange={(checked) => onChange({ ...options, hasDividers: checked })}
            description="Pionowe przegrody między otworami"
          />
          
          {options.hasDividers && (
            <Input
              label="Liczba przegród"
              type="number"
              min="1"
              max="20"
              value={options.dividersCount?.toString() || '4'}
              onChange={(e) => onChange({ 
                ...options, 
                dividersCount: parseInt(e.target.value) || 4 
              })}
            />
          )}
        </div>

        {/* Materiał i grafika */}
        <div className={styles.materialSection}>
          <Select
            label="Rodzaj plexi"
            value={options.material}
            onChange={(value) => onChange({ ...options, material: value as any })}
            options={[
              { value: 'bezbarwna', label: 'Bezbarwna (30 zł/m²)' },
              { value: 'mleczna', label: 'Mleczna (+10%)' },
              { value: 'kolorowa_3mm', label: 'Kolorowa 3mm (120 zł/m²)' },
              { value: 'kolorowa_5mm', label: 'Kolorowa 5mm (200 zł/m²)' }
            ]}
          />

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
        </div>

        {/* Wizualizacja półki z otworami */}
        <div className={styles.holesPreview}>
          <h5>Podgląd półki z otworami</h5>
          <svg viewBox="0 0 400 100" width="100%" height="100">
            <rect x="10" y="20" width="380" height="60" 
                  fill="var(--color-bg-tertiary)" 
                  stroke="var(--color-accent-blue)" 
                  strokeWidth="2" rx={4} />
            
            {Array.from({ length: options.holesPerShelf }, (_, i) => {
              const spacing = 380 / (options.holesPerShelf + 1);
              const x = 10 + spacing * (i + 1);
              return (
                <circle key={i} cx={x} cy="50" r="20" 
                        fill="var(--color-bg-primary)" 
                        stroke="var(--color-accent-orange)" 
                        strokeWidth="2" />
              );
            })}
            
            {options.hasDividers && Array.from({ length: options.dividersCount || 0 }, (_, i) => {
              const spacing = 380 / ((options.dividersCount || 0) + 1);
              const x = 10 + spacing * (i + 1);
              return (
                <line key={i} x1={x} y1="25" x2={x} y2="75" 
                      stroke="var(--color-accent-orange)" 
                      strokeWidth="1" 
                      strokeDasharray="2,2" />
              );
            })}
          </svg>
        </div>
      </div>
    </motion.div>
  );
};