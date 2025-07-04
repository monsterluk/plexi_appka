// components/ProductOptions/ImpulsKasowy/ImpulsKasowyOptions.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImpulsKasowyOptions as ImpulsOptionsType } from '../../../types/impuls.types';
import { Checkbox } from '../../UI/Checkbox';
import { RadioGroup } from '../../UI/RadioGroup';
import { Slider } from '../../UI/Slider';
import { Input } from '../../UI/Input';
import { ImpulsVisualizer } from './ImpulsVisualizer';
import { 
  ShoppingCart, 
  Layers, 
  Image, 
  Ruler,
  AlertCircle,
  Info
} from 'lucide-react';
import { Tooltip } from '../../UI/Tooltip';
import styles from './ImpulsKasowyOptions.module.css';

interface Props {
  options: ImpulsOptionsType;
  onChange: (options: ImpulsOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const ImpulsKasowyOptions: React.FC<Props> = ({
  options,
  onChange,
  dimensions
}) => {
  // Oblicz wysokość półki
  const calculateShelfSpacing = () => {
    const availableHeight = dimensions.height - 50; // margines górny/dolny
    return Math.floor(availableHeight / (options.shelvesCount + 1));
  };

  const shelfSpacing = calculateShelfSpacing();

  // Aktualizacja opcji
  const updateOption = (key: keyof ImpulsOptionsType, value: any) => {
    onChange({ ...options, [key]: value });
  };

  const updateFeature = (feature: keyof ImpulsOptionsType['features'], value: boolean) => {
    onChange({
      ...options,
      features: { ...options.features, [feature]: value }
    });
  };

  const updateGraphics = (key: keyof ImpulsOptionsType['graphics'], value: any) => {
    onChange({
      ...options,
      graphics: { ...options.graphics, [key]: value }
    });
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Nagłówek */}
      <div className={styles.header}>
        <ShoppingCart size={32} className={styles.headerIcon} />
        <div>
          <h3>Konfiguracja impulsu kasowego</h3>
          <p className={styles.description}>
            Ekspozytor przykasowy z półkami i ogranicznikami. 
            Idealny do prezentacji małych produktów przy kasie.
          </p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Wizualizacja */}
        <div className={styles.visualizationSection}>
          <ImpulsVisualizer
            dimensions={dimensions}
            options={options}
            shelfSpacing={shelfSpacing}
          />
        </div>

        {/* Opcje konfiguracji */}
        <div className={styles.optionsSection}>
          {/* Sekcja materiału */}
          <div className={styles.materialSection}>
            <h4>
              <Layers size={20} />
              Materiał i konstrukcja
            </h4>

            <RadioGroup
              label="Rodzaj plexi"
              value={options.plexiType}
              onChange={(value) => updateOption('plexiType', value)}
              options={[
                { 
                  value: 'clear', 
                  label: 'Plexi bezbarwna',
                  description: 'Standardowa, przezroczysta'
                },
                { 
                  value: 'white', 
                  label: 'Plexi biała',
                  description: 'Nieprzezroczysta, elegancka'
                }
              ]}
            />

            <div className={styles.thicknessControl}>
              <label>
                Grubość materiału: <strong>{options.thickness} mm</strong>
              </label>
              <Slider
                min={1}
                max={20}
                value={options.thickness}
                onChange={(value) => updateOption('thickness', value)}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' },
                  { value: 20, label: '20' }
                ]}
              />
              <p className={styles.hint}>
                Zalecana grubość dla stabilności: 3-5 mm
              </p>
            </div>

            <div className={styles.shelvesControl}>
              <label>
                Liczba półek: <strong>{options.shelvesCount}</strong>
                <Tooltip content="Minimalna liczba półek to 2">
                  <Info size={16} className={styles.infoIcon} />
                </Tooltip>
              </label>
              <Slider
                min={2}
                max={8}
                value={options.shelvesCount}
                onChange={(value) => updateOption('shelvesCount', value)}
                step={1}
                marks={[
                  { value: 2, label: '2' },
                  { value: 4, label: '4' },
                  { value: 6, label: '6' },
                  { value: 8, label: '8' }
                ]}
              />
              <p className={styles.shelfInfo}>
                Rozstaw półek: ~{shelfSpacing} mm
              </p>
            </div>

            {/* Wysokość ogranicznika */}
            <Checkbox
              label="Niestandardowa wysokość ogranicznika"
              checked={options.features.customLimiterHeight}
              onChange={(checked) => updateFeature('customLimiterHeight', checked)}
              description="Domyślnie 60 mm"
            />

            {options.features.customLimiterHeight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  label="Wysokość ogranicznika (mm)"
                  type="number"
                  min="30"
                  max="100"
                  value={options.limiterHeight}
                  onChange={(e) => updateOption('limiterHeight', parseInt(e.target.value) || 60)}
                  icon={<Ruler size={18} />}
                />
              </motion.div>
            )}
          </div>

          {/* Sekcja grafiki */}
          <div className={styles.graphicsSection}>
            <h4>
              <Image size={20} />
              Grafika reklamowa
            </h4>

            <Checkbox
              label="Dodaj grafikę"
              checked={options.graphics.enabled}
              onChange={(checked) => updateGraphics('enabled', checked)}
              description="Nadruk UV na plexi"
            />

            <AnimatePresence>
              {options.graphics.enabled && (
                <motion.div
                  className={styles.graphicsOptions}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <RadioGroup
                    label="Typ grafiki"
                    value={options.graphics.type}
                    onChange={(value) => updateGraphics('type', value)}
                    options={[
                      { 
                        value: 'single', 
                        label: 'Jednostronna (75 zł/m²)',
                        description: 'Nadruk z jednej strony'
                      },
                      { 
                        value: 'double', 
                        label: 'Dwustronna (150 zł/m²)',
                        description: 'Nadruk z obu stron'
                      }
                    ]}
                  />

                  <RadioGroup
                    label="Pokrycie graficzne"
                    value={options.graphics.coverage}
                    onChange={(value) => updateGraphics('coverage', value)}
                    options={[
                      { 
                        value: 'back-only', 
                        label: 'Tylko plecy',
                        description: 'Grafika na tylnej ścianie'
                      },
                      { 
                        value: 'full', 
                        label: 'Pełne pokrycie',
                        description: 'Plecy + boki'
                      }
                    ]}
                  />

                  <div className={styles.graphicsPreview}>
                    <p>Szacunkowa powierzchnia do zadruku:</p>
                    <span className={styles.surface}>
                      {calculateGraphicsSurface(dimensions, options).toFixed(3)} m²
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Opcje dodatkowe */}
          <div className={styles.additionalSection}>
            <h4>Opcje dodatkowe</h4>

            <Checkbox
              label="Wzmocnione półki"
              checked={options.features.reinforcedShelves}
              onChange={(checked) => updateFeature('reinforcedShelves', checked)}
              description="Grubsze półki dla cięższych produktów"
            />

            <Checkbox
              label="Zaokrąglone rogi"
              checked={options.features.roundedCorners}
              onChange={(checked) => updateFeature('roundedCorners', checked)}
              description="Bezpieczniejsze, estetyczne wykończenie"
            />

            <Checkbox
              label="Paski antypoślizgowe"
              checked={options.features.antiSlipStrips}
              onChange={(checked) => updateFeature('antiSlipStrips', checked)}
              description="Zapobiegają zsuwaniu się produktów"
            />
          </div>
        </div>
      </div>

      {/* Podsumowanie */}
      <div className={styles.summary}>
        <h5>Specyfikacja konstrukcji:</h5>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Wymiary:</span>
            <span className={styles.value}>
              {dimensions.width} × {dimensions.height} × {dimensions.depth} mm
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Liczba elementów:</span>
            <span className={styles.value}>
              {3 + options.shelvesCount * 2} szt.
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Ograniczniki:</span>
            <span className={styles.value}>
              {options.shelvesCount} × {options.limiterHeight} mm
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Gięcie na gorąco:</span>
            <span className={styles.value}>
              {(dimensions.width * options.shelvesCount / 1000).toFixed(2)} mb
            </span>
          </div>
        </div>

        {/* Informacja o konstrukcji */}
        <div className={styles.constructionInfo}>
          <AlertCircle size={16} />
          <p>
            Impuls kasowy składa się z pleców, dwóch boków oraz {options.shelvesCount} półek
            z zagiętymi ogranicznikami. Wszystkie elementy łączone na klej lub kątowniki.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Funkcja pomocnicza do obliczenia powierzchni grafiki
function calculateGraphicsSurface(
  dimensions: { width: number; height: number; depth: number },
  options: ImpulsOptionsType
): number {
  let surface = 0;
  
  // Plecy
  surface += (dimensions.width * dimensions.height) / 1e6;
  
  // Boki (jeśli pełne pokrycie)
  if (options.graphics.coverage === 'full') {
    surface += 2 * (dimensions.depth * dimensions.height) / 1e6;
  }
  
  return surface;
}