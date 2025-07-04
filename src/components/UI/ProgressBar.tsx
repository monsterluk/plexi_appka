// components/UI/ProgressBar.tsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0-100
  steps?: string[];
  currentStep?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  steps, 
  currentStep = 0 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.barWrapper}>
        <div className={styles.barBackground}>
          <motion.div 
            className={styles.barFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className={styles.percentage}>{Math.round(progress)}%</span>
      </div>
      
      {steps && (
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`
                ${styles.step} 
                ${index <= currentStep ? styles.stepActive : ''}
                ${index === currentStep ? styles.stepCurrent : ''}
              `}
            >
              <div className={styles.stepDot}>
                <span>{index + 1}</span>
              </div>
              <span className={styles.stepLabel}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};