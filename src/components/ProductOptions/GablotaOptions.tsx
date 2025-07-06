// components/ProductOptions/GablotaOptions.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GablotaOptions as GablotaOptionsType } from '../../types/gablota.types';
import { MaterialSpec } from '../../types/calculator.types';
import { Checkbox } from '../UI/Checkbox';
import { Select } from '../UI/Select';
import { Slider } from '../UI/Slider';
import { Input } from '../UI/Input';
import { RadioGroup } from '../UI/RadioGroup';
import { Info, Box, Layers, Wind, Settings } from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';
import styles from './GablotaOptions.module.css';

// Interfejs dla materiału
interface Material extends MaterialSpec {
  id: number;
  nazwa: string;
  cena_za_m2: number;
}

// Tymczasowa definicja materiałów - zastąp importem z Data/materials gdy będzie dostępny
const materials: Material[] = [
  { id: 1, nazwa: 'Plexi 3mm', cena_za_m2: 120, name: 'Plexi 3mm', pricePerM2: 120, density: 1190 },
  { id: 2, nazwa: 'Plexi 5mm', cena_za_m2: 180, name: 'Plexi 5mm', pricePerM2: 180, density: 1190 },
  { id: 3, nazwa: 'Plexi 8mm', cena_za_m2: 280, name: 'Plexi 8mm', pricePerM2: 280, density: 1190 },
  { id: 4, nazwa: 'Plexi 10mm', cena_za_m2: 350, name: 'Plexi 10mm', pricePerM2: 350, density: 1190 },
  { id: 5, nazwa: 'Dibond 3mm', cena_za_m2: 150, name: 'Dibond 3mm', pricePerM2: 150, density: 1500 },
  { id: 6, nazwa: 'PCV 5mm', cena_za_m2: 100, name: 'PCV 5mm', pricePerM2: 100, density: 1400 },
];

interface Props {
  onOptionsChange: (options: GablotaOptionsType) => void;
  initialOptions?: Partial<GablotaOptionsType>;
}

export const GablotaOptions: React.FC<Props> = ({
  onOptionsChange,
  initialOptions
}) => {
  // Domyślne wymiary
  const defaultDimensions = { width: 500, height: 400, depth: 300 };
  
  const [options, setOptions] = useState<GablotaOptionsType>({
    material: initialOptions?.material || materials[0],
    thickness: initialOptions?.thickness || 5,
    hasBase: initialOptions?.hasBase || false,
    baseMaterial: initialOptions?.baseMaterial,
    baseThickness: initialOptions?.baseThickness,
    partitions: initialOptions?.partitions || {
      enabled: false,
      horizontal: 0,
      vertical: 0
    },
    hasBackLighting: initialOptions?.hasBackLighting || false,
    hasMagneticClosure: initialOptions?.hasMagneticClosure || false,
    ventilationHoles: initialOptions?.ventilationHoles || 0
  });

  const [dimensions] = useState(defaultDimensions);

  useEffect(() => {
    onOptionsChange(options);
  }, [options]); // Celowo pomijamy onOptionsChange

  const updateOption = (updates: Partial<GablotaOptionsType>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  };

  // Oblicz koszt podstawy dla podglądu
  const calculateBaseCost = () => {
    if (!options.hasBase || !options.baseMaterial || !options.baseThickness) {
      return 0;
    }
    const baseSurface = (dimensions.width * dimensions.depth) / 1e6;
    return baseSurface * options.baseMaterial.pricePerM2 * options.baseThickness;
  };

  const baseCost = calculateBaseCost();

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h3>Opcje gabloty ekspozycyjnej</h3>
        <p className={styles.description}>
          Gablota składa się z 5 ścian (bez frontu). 
          Opcjonalnie można dodać podstawę z innego materiału.
        </p>
      </div>

      {/* Wizualizacja 3D */}
      <div className={styles.visualization}>
        <GablotaVisualization 
          dimensions={dimensions}
          hasBase={options.hasBase}
          partitions={options.partitions}
        />
      </div>

      <div className={styles.optionsGrid}>
        {/* Sekcja podstawy/dna */}
        <div className={styles.baseSection}>
          <div className={styles.sectionHeader}>
            <Box size={20} />
            <h4>Podstawa (dno) gabloty</h4>
          </div>

          <Checkbox
            label="Dodaj podstawę (dno)"
            checked={options.hasBase}
            onChange={(checked) => updateOption({ hasBase: checked })}
            description="Podstawa może być wykonana z innego materiału"
            icon={<Layers size={16} />}
          />

          <AnimatePresence>
            {options.hasBase && (
              <motion.div
                className={styles.baseOptions}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Select
                  label="Materiał podstawy"
                  value={options.baseMaterial?.id?.toString() || ''}
                  onChange={(value) => {
                    const material = materials.find(m => m.id === parseInt(value));
                    if (material) {
                      updateOption({ baseMaterial: material });
                    }
                  }}
                  options={materials.map(mat => ({
                    value: mat.id.toString(),
                    label: `${mat.nazwa} (${mat.cena_za_m2} zł/m²)`
                  }))}
                  tooltip="Wybierz materiał dla podstawy gabloty"
                />

                <div className={styles.thicknessSlider}>
                  <label>
                    Grubość podstawy: <strong>{options.baseThickness || 3} mm</strong>
                  </label>
                  <Slider
                    min={1}
                    max={20}
                    value={options.baseThickness || 3}
                    onChange={(value) => updateOption({ baseThickness: value })}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 15, label: '15' },
                      { value: 20, label: '20' }
                    ]}
                  />
                  <p className={styles.hint}>
                    Grubsza podstawa zapewnia lepszą stabilność
                  </p>
                </div>

                {baseCost > 0 && (
                  <div className={styles.baseCostPreview}>
                    <span>Szacunkowy koszt podstawy:</span>
                    <span className={styles.cost}>{baseCost.toFixed(2)} zł</span>
                    <Tooltip content="Koszt podstawy nie jest objęty mnożnikiem">
                      <Info size={14} />
                    </Tooltip>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sekcja przegród */}
        <div className={styles.partitionsSection}>
          <div className={styles.sectionHeader}>
            <Layers size={20} />
            <h4>Przegrody wewnętrzne</h4>
          </div>

          <Checkbox
            label="Dodaj przegrody"
            checked={options.partitions.enabled}
            onChange={(checked) => updateOption({
              partitions: { ...options.partitions, enabled: checked }
            })}
            description="Przegrody dzielą przestrzeń gabloty"
          />

          {options.partitions.enabled && (
            <motion.div
              className={styles.partitionOptions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Input
                label="Przegrody poziome"
                type="number"
                min="0"
                max="10"
                value={options.partitions.horizontal.toString()}
                onChange={(e) => updateOption({
                  partitions: {
                    ...options.partitions,
                    horizontal: parseInt(e.target.value) || 0
                  }
                })}
                tooltip="Liczba poziomych półek"
              />

              <Input
                label="Przegrody pionowe"
                type="number"
                min="0"
                max="10"
                value={options.partitions.vertical.toString()}
                onChange={(e) => updateOption({
                  partitions: {
                    ...options.partitions,
                    vertical: parseInt(e.target.value) || 0
                  }
                })}
                tooltip="Liczba pionowych przegród"
              />
            </motion.div>
          )}
        </div>

        {/* Sekcja opcji dodatkowych */}
        <div className={styles.additionalSection}>
          <div className={styles.sectionHeader}>
            <Settings size={20} />
            <h4>Opcje dodatkowe</h4>
          </div>

          <Checkbox
            label="Podświetlenie LED"
            checked={options.hasBackLighting}
            onChange={(checked) => updateOption({ hasBackLighting: checked })}
            description="Taśma LED w górnej części gabloty"
          />

          <Checkbox
            label="Zamknięcie magnetyczne"
            checked={options.hasMagneticClosure}
            onChange={(checked) => updateOption({ hasMagneticClosure: checked })}
            description="Magnesy do mocowania frontu"
          />

          <div className={styles.ventilationOption}>
            <label>
              <Wind size={18} />
              Otwory wentylacyjne
            </label>
            <Input
              label=""
              type="number"
              min="0"
              max="50"
              value={options.ventilationHoles.toString()}
              onChange={(e) => updateOption({
                ventilationHoles: parseInt(e.target.value) || 0
              })}
              tooltip="Liczba otworów wentylacyjnych (5mm)"
            />
          </div>
        </div>
      </div>

      {/* Podsumowanie opcji */}
      <div className={styles.summary}>
        <h5>Podsumowanie konfiguracji:</h5>
        <ul>
          <li>Gablota 5-ścienna (bez frontu)</li>
          {options.hasBase && (
            <li>
              Podstawa: {options.baseMaterial?.nazwa} {options.baseThickness}mm
            </li>
          )}
          {options.partitions.enabled && (
            <li>
              Przegrody: {options.partitions.horizontal} poziomych, 
              {options.partitions.vertical} pionowych
            </li>
          )}
          {options.hasBackLighting && <li>Podświetlenie LED</li>}
          {options.hasMagneticClosure && <li>Zamknięcie magnetyczne</li>}
          {options.ventilationHoles > 0 && (
            <li>Otwory wentylacyjne: {options.ventilationHoles} szt.</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

// Komponent wizualizacji 3D
const GablotaVisualization: React.FC<{
  dimensions: { width: number; height: number; depth: number };
  hasBase: boolean;
  partitions: { enabled: boolean; horizontal: number; vertical: number };
}> = ({ dimensions, hasBase, partitions }) => {
  const scale = 0.3;
  const { width, height, depth } = dimensions;
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;

  return (
    <svg viewBox="0 0 500 400" width="100%" height="400">
      <defs>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#90caf9', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#64b5f6', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      <g transform="translate(250, 200)">
        {/* Tył */}
        <path 
          d={`M ${-w/2},${-h/2} L ${-w/2+d*0.5},${-h/2-d*0.3}
              L ${-w/2+d*0.5},${h/2-d*0.3} L ${-w/2},${h/2} Z`}
          fill="#bbdefb" 
          stroke="#1976d2" 
          strokeWidth="2"
        />

        {/* Podstawa (opcjonalna) */}
        {hasBase && (
          <path 
            d={`M ${-w/2},${h/2} L ${-w/2+d*0.5},${h/2-d*0.3}
                L ${w/2+d*0.5},${h/2-d*0.3} L ${w/2},${h/2} Z`}
            fill="#ff9800" 
            stroke="#e65100" 
            strokeWidth="2"
            opacity="0.8"
          />
        )}

        {/* Góra */}
        <path 
          d={`M ${-w/2},${-h/2} L ${-w/2+d*0.5},${-h/2-d*0.3}
              L ${w/2+d*0.5},${-h/2-d*0.3} L ${w/2},${-h/2} Z`}
          fill="#90caf9" 
          stroke="#1976d2" 
          strokeWidth="2"
        />

        {/* Lewy bok */}
        <path 
          d={`M ${-w/2},${-h/2} L ${-w/2},${h/2}
              L ${-w/2+d*0.5},${h/2-d*0.3} L ${-w/2+d*0.5},${-h/2-d*0.3} Z`}
          fill="#64b5f6" 
          stroke="#1976d2" 
          strokeWidth="2"
        />

        {/* Prawy bok */}
        <path 
          d={`M ${w/2+d*0.5},${-h/2-d*0.3} L ${w/2+d*0.5},${h/2-d*0.3}
              L ${w/2},${h/2} L ${w/2},${-h/2} Z`}
          fill="#64b5f6" 
          stroke="#1976d2" 
          strokeWidth="2"
        />

        {/* Front (przezroczysty) */}
        <path 
          d={`M ${w/2},${-h/2} L ${w/2},${h/2}
              L ${-w/2},${h/2} L ${-w/2},${-h/2} Z`}
          fill="url(#glassGradient)" 
          stroke="#1976d2" 
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Przegrody poziome */}
        {partitions.enabled && Array.from({ length: partitions.horizontal }, (_, i) => {
          const y = -h/2 + (h / (partitions.horizontal + 1)) * (i + 1);
          return (
            <g key={`h-${i}`}>
              <line 
                x1={-w/2} y1={y} 
                x2={w/2} y2={y}
                stroke="#ff5722" 
                strokeWidth="1.5" 
                opacity="0.7"
              />
              <line 
                x1={-w/2+d*0.5} y1={y-d*0.3*(i+1)/(partitions.horizontal+1)} 
                x2={w/2+d*0.5} y2={y-d*0.3*(i+1)/(partitions.horizontal+1)}
                stroke="#ff5722" 
                strokeWidth="1.5" 
                opacity="0.7"
              />
            </g>
          );
        })}

        {/* Przegrody pionowe */}
        {partitions.enabled && Array.from({ length: partitions.vertical }, (_, i) => {
          const x = -w/2 + (w / (partitions.vertical + 1)) * (i + 1);
          return (
            <line 
              key={`v-${i}`}
              x1={x} y1={-h/2} 
              x2={x} y2={h/2}
              stroke="#ff5722" 
              strokeWidth="1.5" 
              opacity="0.7"
            />
          );
        })}

        {/* Etykiety */}
        <text x="0" y={-h/2 - 20} textAnchor="middle" fontSize="14" fill="#666">
          Gablota ekspozycyjna
        </text>
        
        {!hasBase && (
          <text x="0" y={h/2 + 30} textAnchor="middle" fontSize="12" fill="#999">
            (bez podstawy)
          </text>
        )}
      </g>
    </svg>
  );
};