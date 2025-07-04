// components/ProductOptions/Obudowa/WallSelector.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X, RotateCw, Eye, EyeOff } from 'lucide-react';
import { WallConfig } from '../../../types/obudowa.types';
import { Tooltip } from '../../UI/Tooltip';
import styles from './WallSelector.module.css';

interface Props {
  walls: Record<string, WallConfig>;
  onChange: (walls: Record<string, WallConfig>) => void;
  dimensions: { width: number; height: number; depth: number };
}

type WallName = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

const wallLabels: Record<WallName, string> = {
  front: 'Przód',
  back: 'Tył',
  left: 'Lewa',
  right: 'Prawa',
  top: 'Góra',
  bottom: 'Dół'
};

export const WallSelector: React.FC<Props> = ({ walls, onChange, dimensions }) => {
  const [rotationY, setRotationY] = useState(25);
  const [rotationX, setRotationX] = useState(25);
  const [showLabels, setShowLabels] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCount = Object.values(walls).filter(w => w.enabled).length;
  const isValidConfig = selectedCount >= 3;

  // Walidacja konfiguracji
  const getValidation = () => {
    const warnings: string[] = [];
    
    if (!walls.back.enabled) {
      warnings.push('Brak tylnej ściany może ograniczyć stabilność');
    }
    
    if (!walls.bottom.enabled && !walls.top.enabled) {
      warnings.push('Obudowa bez góry i dołu wymaga specjalnego montażu');
    }
    
    if (selectedCount === 6) {
      warnings.push('Pełna obudowa - pamiętaj o wentylacji!');
    }
    
    return warnings;
  };

  const warnings = getValidation();

  // Obsługa obracania modelu
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.movementX;
    const deltaY = e.movementY;
    
    setRotationY(prev => (prev + deltaX) % 360);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - deltaY)));
  };

  // Toggle ściany
  const toggleWall = (wall: WallName) => {
    const newWalls = {
      ...walls,
      [wall]: { ...walls[wall], enabled: !walls[wall].enabled }
    };
    
    // Sprawdź czy będzie minimum 3 ściany
    const newCount = Object.values(newWalls).filter(w => w.enabled).length;
    if (newCount < 3 && walls[wall].enabled) {
      return; // Nie pozwól na mniej niż 3 ściany
    }
    
    onChange(newWalls);
  };

  // Szybkie presety
  const applyPreset = (preset: 'minimal' | 'standard' | 'full' | 'u-shape') => {
    const presets = {
      minimal: { front: false, back: true, left: true, right: true, top: false, bottom: false },
      standard: { front: false, back: true, left: true, right: true, top: true, bottom: true },
      full: { front: true, back: true, left: true, right: true, top: true, bottom: true },
      'u-shape': { front: false, back: true, left: true, right: true, top: false, bottom: true }
    };
    
    const newWalls = Object.entries(presets[preset]).reduce((acc, [wall, enabled]) => ({
      ...acc,
      [wall]: { ...walls[wall as WallName], enabled }
    }), {});
    
    onChange(newWalls);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Wybierz ściany obudowy</h4>
        <div className={styles.counter}>
          <span className={selectedCount >= 3 ? styles.valid : styles.invalid}>
            {selectedCount}/6 ścian
          </span>
          {!isValidConfig && (
            <Tooltip content="Minimum 3 ściany">
              <AlertTriangle size={16} className={styles.warning} />
            </Tooltip>
          )}
        </div>
      </div>

      {/* Kontrolki widoku */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={() => setShowLabels(!showLabels)}
        >
          {showLabels ? <Eye size={18} /> : <EyeOff size={18} />}
          <span>Etykiety</span>
        </button>
        
        <button
          className={styles.controlButton}
          onClick={() => { setRotationY(25); setRotationX(25); }}
        >
          <RotateCw size={18} />
          <span>Resetuj widok</span>
        </button>
      </div>

      {/* Wizualizacja 3D */}
      <div 
        className={styles.visualization}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className={styles.cube}
          style={{
            transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`
          }}
        >
          {/* Renderuj każdą ścianę */}
          {(Object.entries(walls) as [WallName, WallConfig][]).map(([wall, config]) => (
            <motion.div
              key={wall}
              className={`${styles.wall} ${styles[wall]} ${config.enabled ? styles.selected : ''}`}
              onClick={() => toggleWall(wall)}
              animate={{
                opacity: config.enabled ? 1 : 0.3,
                scale: config.enabled ? 1 : 0.95
              }}
              transition={{ duration: 0.2 }}
            >
              {showLabels && (
                <div className={styles.wallLabel}>
                  <span>{wallLabels[wall]}</span>
                  {config.enabled ? (
                    <Check size={16} className={styles.checkIcon} />
                  ) : (
                    <X size={16} className={styles.xIcon} />
                  )}
                </div>
              )}
              
              {/* Wzór otworów wentylacyjnych */}
              {config.enabled && config.hasVentilation && (
                <div className={styles.ventPattern}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className={styles.ventHole} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className={styles.hint}>
          Kliknij na ścianę aby ją włączyć/wyłączyć. Przeciągnij aby obrócić.
        </p>
      </div>

      {/* Szybkie presety */}
      <div className={styles.presets}>
        <h5>Szybkie konfiguracje:</h5>
        <div className={styles.presetButtons}>
          <button
            className={styles.presetButton}
            onClick={() => applyPreset('minimal')}
          >
            <div className={styles.presetIcon}>⊔</div>
            <span>Minimalna (3)</span>
          </button>
          
          <button
            className={styles.presetButton}
            onClick={() => applyPreset('u-shape')}
          >
            <div className={styles.presetIcon}>⊐</div>
            <span>Kształt U</span>
          </button>
          
          <button
            className={styles.presetButton}
            onClick={() => applyPreset('standard')}
          >
            <div className={styles.presetIcon}>□</div>
            <span>Standardowa (5)</span>
          </button>
          
          <button
            className={styles.presetButton}
            onClick={() => applyPreset('full')}
          >
            <div className={styles.presetIcon}>■</div>
            <span>Pełna (6)</span>
          </button>
        </div>
      </div>

      {/* Ostrzeżenia */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            className={styles.warnings}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {warnings.map((warning, index) => (
              <div key={index} className={styles.warningItem}>
                <AlertTriangle size={16} />
                <span>{warning}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista wybranych ścian */}
      <div className={styles.selectedList}>
        <h5>Wybrane ściany:</h5>
        <div className={styles.wallTags}>
          {(Object.entries(walls) as [WallName, WallConfig][])
            .filter(([_, config]) => config.enabled)
            .map(([wall, _]) => (
              <motion.div
                key={wall}
                className={styles.wallTag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <span>{wallLabels[wall]}</span>
                <button
                  className={styles.removeButton}
                  onClick={() => toggleWall(wall)}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};