// components/UI/RadioGroup.tsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './RadioGroup.module.css';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
  orientation = 'vertical'
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option, index) => (
          <motion.label
            key={option.value}
            className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={styles.input}
            />
            
            <div className={styles.radioButton}>
              <div className={styles.radioOuter}>
                <motion.div 
                  className={styles.radioInner}
                  initial={false}
                  animate={{
                    scale: value === option.value ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
            
            <div className={styles.content}>
              <span className={styles.optionLabel}>{option.label}</span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </div>
          </motion.label>
        ))}
      </div>
    </div>
  );
};