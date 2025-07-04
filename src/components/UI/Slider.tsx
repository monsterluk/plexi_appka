// components/UI/Slider.tsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Slider.module.css';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  marks?: { value: number; label: string }[];
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  marks
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <motion.div 
          className={styles.fill}
          style={{ width: `${percentage}%` }}
          layout
          transition={{ duration: 0.2 }}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          step={step}
          className={styles.input}
        />
        
        <div 
          className={styles.thumb}
          style={{ left: `${percentage}%` }}
        >
          <span className={styles.value}>{value}</span>
        </div>
      </div>
      
      {marks && (
        <div className={styles.marks}>
          {marks.map((mark) => (
            <div
              key={mark.value}
              className={styles.mark}
              style={{
                left: `${((mark.value - min) / (max - min)) * 100}%`
              }}
            >
              <div className={styles.markTick} />
              <span className={styles.markLabel}>{mark.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};