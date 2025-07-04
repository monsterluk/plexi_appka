// components/ProductOptions/Obudowa/ObudowaOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ObudowaOptions as ObudowaOptionsType } from '../../../types/obudowa.types';
import { MaterialSpec } from '../../../types/calculator.types';
import { WallSelector } from './WallSelector';
import { Checkbox } from '../../UI/Checkbox';
import { Select } from '../../UI/Select';
import { RadioGroup } from '../../UI/RadioGroup';
import { Input } from '../../UI/Input';
import { 
  Shield, 
  Wind, 
  Cable, 
  DoorOpen, 
  Square, 
  Handle,
  Fan
} from 'lucide-react';
import { materials } from '../../../data/materials';
import styles from './ObudowaOptions.module.css';

interface Props {
  options: ObudowaOptionsType;
  onChange: (options: ObudowaOptionsType) => void;
  dimensions: { width: number; height: number; depth: number };
}

export const ObudowaOptions: React.FC<Props> = ({
  options,
  onChange,
  dimensions
}) => {
  // Aktualizacja opcji ścian
  const handleWallsChange = (walls: ObudowaOptionsType['walls']) => {
    onChange({ ...options, walls });
  };

  // Aktualizacja funkcji
  const handleFeatureChange = (feature: keyof ObudowaOptionsType['features'], value: any) => {
    onChange({
      ...options,
      features: { ...options.features, [feature]: value }
    });
  };

  // Walidacja
  const selectedWallsCount = Object.values(options.walls).filter(w => w.enabled).length;
  const isValid = selectedWallsCount >= 3;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <Shield size={32} className={styles.icon} />
        <div>
          <h3>Konfiguracja obudowy technicznej</h3>
          <p className={styles.description}>
            Obudowy i osłony przemysłowe z możliwością wyboru od 3 do 6 ścian.
            Idealne do zabezpieczenia urządzeń elektronicznych, skrzynek rozdzielczych
            i innych instalacji technicznych.
          </p>
        </div>
      </div>

      {/* Selektor ścian */}
      <WallSelector
        walls={options.walls}
        onChange={handleWallsChange}
        dimensions={dimensions}
      />

      <div className={styles.optionsGrid}>
        {/* Sekcja funkcjonalności */}
        <div className={styles.section}>
          <h4>
            <DoorOpen size={20} />
            Funkcje dostępu
          </h4>

          <Checkbox
            label="Drzwiczki"
            checked={options.features.hasDoor}
            onChange={(checked) => handleFeatureChange('hasDoor', checked)}
            description="Drzwiczki na zawiasach z zamkiem"
          />

          {options.features.hasDoor && (
            <RadioGroup
              label="Strona montażu drzwiczek"
              value={options.features.doorSide || 'front'}
              onChange={(value) => handleFeatureChange('doorSide', value)}
              options={[
                { value: 'front', label: 'Przód' },
                { value: 'left', label: 'Lewa strona' },
                { value: 'right', label: 'Prawa strona' }
              ]}
              orientation="horizontal"
            />
          )}

          <Checkbox
            label="Okno inspekcyjne"
            checked={options.features.hasWindow}
            onChange={(checked) => handleFeatureChange('hasWindow', checked)}
            description="Przezroczyste okno do podglądu"
            icon={<Square size={16} />}
          />

          {options.features.hasWindow && (
            <div className={styles.windowSize}>
              <Input
                label="Szerokość okna (mm)"
                type="number"
                min="50"
                max={dimensions.width - 100}
                value={options.features.windowSize?.width || 200}
                onChange={(e) => handleFeatureChange('windowSize', {
                  ...options.features.windowSize,
                  width: parseInt(e.target.value) || 200
                })}
              />
              <Input
                label="Wysokość okna (mm)"
                type="number"
                min="50"
                max={dimensions.height - 100}
                value={options.features.windowSize?.height || 150}
                onChange={(e) => handleFeatureChange('windowSize', {
                  ...options.features.windowSize,
                  height: parseInt(e.target.value) || 150
                })}
              />
            </div>
          )}

          <Checkbox
            label="Uchwyt"
            checked={options.features.hasHandle}
            onChange={(checked) => handleFeatureChange('hasHandle', checked)}
            description="Ergonomiczny uchwyt transportowy"
            icon={<Handle size={16} />}
          />
        </div>

        {/* Sekcja wentylacji */}
        <div className={styles.section}>
          <h4>
            <Wind size={20} />
            Wentylacja i chłodzenie
          </h4>

          <div className={styles.ventilationOptions}>
            {Object.entries(options.walls).map(([wall, config]) => (
              config.enabled && (
                <Checkbox
                  key={wall}
                  label={`Otwory wentylacyjne - ${wallLabels[wall as keyof typeof wallLabels]}`}
                  checked={config.hasVentilation || false}
                  onChange={(checked) => {
                    onChange({
                      ...options,
                      walls: {
                        ...options.walls,
                        [wall]: { ...config, hasVentilation: checked }
                      }
                    });
                  }}
                />
              )
            ))}
          </div>

          <Checkbox
            label="Wentylator chłodzący"
            checked={options.features.hasCoolingFan}
            onChange={(checked) => handleFeatureChange('hasCoolingFan', checked)}
            description="Aktywne chłodzenie wentylatorem"
            icon={<Fan size={16} />}
          />

          {options.features.hasCoolingFan && (
            <Input
              label="Liczba wentylatorów"
              type="number"
              min="1"
              max="4"
              value={options.features.fanCount || 1}
              onChange={(e) => handleFeatureChange('fanCount', parseInt(e.target.value) || 1)}
            />
          )}
        </div>

        {/* Sekcja kabli */}
        <div className={styles.section}>
          <h4>
            <Cable size={20} />
            Przepusty kablowe
          </h4>

          <div className={styles.cableOptions}>
            {Object.entries(options.walls).map(([wall, config]) => (
              config.enabled && (
                <Checkbox
                  key={`cable-${wall}`}
                  label={`Otwory kablowe - ${wallLabels[wall as keyof typeof wallLabels]}`}
                  checked={config.hasCableHoles || false}
                  onChange={(checked) => {
                    onChange({
                      ...options,
                      walls: {
                        ...options.walls,
                        [wall]: { ...config, hasCableHoles: checked }
                      }
                    });
                  }}
                />
              )
            ))}
          </div>
        </div>

        {/* Sekcja montażu */}
        <div className={styles.section}>
          <h4>Opcje montażu</h4>

          <RadioGroup
            label="Sposób montażu"
            value={options.mounting.type}
            onChange={(value) => onChange({
              ...options,
              mounting: { ...options.mounting, type: value as any }
            })}
            options={[
              { value: 'wall', label: 'Na ścianie' },
              { value: 'floor', label: 'Na podłodze' },
              { value: 'ceiling', label: 'Pod sufitem' },
              { value: 'standalone', label: 'Wolnostojąca' }
            ]}
          />

          <Checkbox
            label="Szyny montażowe"
            checked={options.mounting.hasRails}
            onChange={(checked) => onChange({
              ...options,
              mounting: { ...options.mounting, hasRails: checked }
            })}
            description="Szyny DIN do montażu urządzeń"
          />

          <Checkbox
            label="Wsporniki"
            checked={options.mounting.hasBrackets}
            onChange={(checked) => onChange({
              ...options,
              mounting: { ...options.mounting, hasBrackets: checked }
            })}
            description="Dodatkowe wsporniki montażowe"
          />
        </div>
      </div>

      {/* Materiał domyślny */}
      <div className={styles.defaultMaterial}>
        <h4>Materiał podstawowy</h4>
        <div className={styles.materialGrid}>
          <Select
            label="Materiał wszystkich ścian"
            value={options.defaultMaterial.id.toString()}
            onChange={(value) => {
              const material = materials.find(m => m.id === parseInt(value));
              if (material) {
                onChange({ ...options, defaultMaterial: material });
              }
            }}
            options={materials.map(mat => ({
              value: mat.id.toString(),
              label: `${mat.nazwa} (${mat.cena_za_m2} zł/m²)`
            }))}
          />

          <Select
            label="Grubość (mm)"
            value={options.defaultThickness.toString()}
            onChange={(value) => onChange({ 
              ...options, 
              defaultThickness: parseInt(value) 
            })}
            options={[
              { value: '2', label: '2 mm' },
              { value: '3', label: '3 mm' },
              { value: '4', label: '4 mm' },
              { value: '5', label: '5 mm' },
              { value: '6', label: '6 mm' },
              { value: '8', label: '8 mm' },
              { value: '10', label: '10 mm' }
            ]}
          />
        </div>
      </div>

      {/* Status walidacji */}
      {!isValid && (
        <motion.div
          className={styles.validationError}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertTriangle size={20} />
          <span>Wybierz minimum 3 ściany do utworzenia obudowy</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Etykiety ścian
const wallLabels = {
  front: 'Przód',
  back: 'Tył',
  left: 'Lewa',
  right: 'Prawa',
  top: 'Góra',
  bottom: 'Dół'
};