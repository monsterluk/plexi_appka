// components/ProductOptions/ContainerOptions.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ContainerOptions as ContainerOptionsType } from '../../types/product.types';
import { Box, Layers, Lock, Settings } from 'lucide-react';
import styles from './ContainerOptions.module.css';

interface Props {
  onOptionsChange: (options: ContainerOptionsType) => void;
  initialOptions?: Partial<ContainerOptionsType>;
}

export const ContainerOptions: React.FC<Props> = ({ onOptionsChange, initialOptions }) => {
  const [options, setOptions] = useState<ContainerOptionsType>({
    material: initialOptions?.material || 'plexi',
    thickness: initialOptions?.thickness || 3,
    width: initialOptions?.width || 300,
    height: initialOptions?.height || 200,
    depth: initialOptions?.depth || 150,
    quantity: initialOptions?.quantity || 1,
    hasLid: initialOptions?.hasLid || false,
    partitions: initialOptions?.partitions || {
      width: { enabled: false, count: 0 },
      length: { enabled: false, count: 0 }
    },
    hardware: initialOptions?.hardware || {
      hinges: 0,
      locks: 0
    }
  });

  useEffect(() => {
    onOptionsChange(options);
  }, [options]); // Celowo pomijamy onOptionsChange

  const updateOption = (key: keyof ContainerOptionsType, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const updatePartition = (type: 'width' | 'length', field: 'enabled' | 'count', value: any) => {
    setOptions(prev => ({
      ...prev,
      partitions: {
        ...prev.partitions,
        [type]: {
          ...prev.partitions[type],
          [field]: value
        }
      }
    }));
  };

  const updateHardware = (type: 'hinges' | 'locks', value: number) => {
    setOptions(prev => ({
      ...prev,
      hardware: {
        ...prev.hardware,
        [type]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper}>
            <Box className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>Pojemnik / Organizer</h2>
            <p className={styles.subtitle}>Skonfiguruj pojemnik według swoich potrzeb</p>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Wymiary</h3>
        <div className={styles.dimensionsGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Szerokość (mm)</label>
            <input
              type="number"
              value={options.width}
              onChange={(e) => updateOption('width', parseInt(e.target.value) || 0)}
              className={styles.input}
              min="50"
              max="1000"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Wysokość (mm)</label>
            <input
              type="number"
              value={options.height}
              onChange={(e) => updateOption('height', parseInt(e.target.value) || 0)}
              className={styles.input}
              min="50"
              max="1000"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Głębokość (mm)</label>
            <input
              type="number"
              value={options.depth}
              onChange={(e) => updateOption('depth', parseInt(e.target.value) || 0)}
              className={styles.input}
              min="50"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Material & Thickness */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Materiał i grubość</h3>
        <div className={styles.materialGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Materiał</label>
            <select
              value={options.material}
              onChange={(e) => updateOption('material', e.target.value as any)}
              className={styles.select}
            >
              <option value="plexi">Plexi (PMMA)</option>
              <option value="hips">HIPS</option>
              <option value="petg">PET-G</option>
              <option value="pc">Poliwęglan</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Grubość (mm)</label>
            <select
              value={options.thickness}
              onChange={(e) => updateOption('thickness', parseInt(e.target.value))}
              className={styles.select}
            >
              {[2, 3, 4, 5, 6, 8, 10].map(t => (
                <option key={t} value={t}>{t} mm</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lid Option */}
      <div className={styles.section}>
        <label className={styles.checkboxOption}>
          <input
            type="checkbox"
            checked={options.hasLid}
            onChange={(e) => updateOption('hasLid', e.target.checked)}
            className={styles.checkbox}
          />
          <div className={styles.checkboxContent}>
            <span className={styles.checkboxLabel}>Dodaj wieko</span>
            <p className={styles.checkboxDescription}>
              Wieko z zawiasami lub zdejmowane
            </p>
          </div>
        </label>
      </div>

      {/* Partitions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Layers className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Przegrody</h3>
        </div>
        
        {/* Width partitions */}
        <div className={styles.partitionOption}>
          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={options.partitions.width.enabled}
              onChange={(e) => updatePartition('width', 'enabled', e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxContent}>
              <span className={styles.checkboxLabel}>Przegrody poprzeczne</span>
            </div>
          </label>
          
          {options.partitions.width.enabled && (
            <div className={styles.partitionCount}>
              <label className={styles.label}>Ilość:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.partitions.width.count}
                onChange={(e) => updatePartition('width', 'count', parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>
          )}
        </div>
        
        {/* Length partitions */}
        <div className={styles.partitionOption}>
          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={options.partitions.length.enabled}
              onChange={(e) => updatePartition('length', 'enabled', e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxContent}>
              <span className={styles.checkboxLabel}>Przegrody podłużne</span>
            </div>
          </label>
          
          {options.partitions.length.enabled && (
            <div className={styles.partitionCount}>
              <label className={styles.label}>Ilość:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.partitions.length.count}
                onChange={(e) => updatePartition('length', 'count', parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hardware */}
      {options.hasLid && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Okucia</h3>
          </div>
          
          <div className={styles.hardwareGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Zawiasy</label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.hardware?.hinges || 0}
                onChange={(e) => updateHardware('hinges', parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Zamki</label>
              <input
                type="number"
                min="0"
                max="5"
                value={options.hardware?.locks || 0}
                onChange={(e) => updateHardware('locks', parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className={styles.section}>
        <label className={styles.label}>Ilość sztuk</label>
        <input
          type="number"
          value={options.quantity}
          onChange={(e) => updateOption('quantity', parseInt(e.target.value) || 1)}
          className={styles.numberInput}
          min="1"
          max="100"
        />
      </div>
    </motion.div>
  );
};