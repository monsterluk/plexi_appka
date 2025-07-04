// components/UI/Checkbox.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  icon?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  description,
  icon
}) => {
  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.input}
      />
      
      <div className={styles.checkbox}>
        <motion.div
          className={styles.checkmark}
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <Check size={14} />
        </motion.div>
      </div>
      
      <div className={styles.content}>
        <span className={styles.label}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {label}
        </span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>
    </label>
  );
};