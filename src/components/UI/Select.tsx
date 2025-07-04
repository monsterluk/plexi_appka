// components/UI/Select.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Tooltip } from './Tooltip';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  tooltip?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  tooltip,
  error
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <label className={styles.label}>{label}</label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info size={16} className={styles.infoIcon} />
          </Tooltip>
        )}
      </div>

      <div className={styles.selectWrapper}>
        <button
          type="button"
          className={`${styles.select} ${error ? styles.error : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.selectedValue}>
            {selectedOption?.label || 'Wybierz...'}
          </span>
          <ChevronDown 
            size={18} 
            className={`${styles.icon} ${isOpen ? styles.open : ''}`}
          />
        </button>

        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`
                  ${styles.option} 
                  ${option.value === value ? styles.selected : ''}
                  ${option.disabled ? styles.disabled : ''}
                `}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                disabled={option.disabled}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {error && (
        <motion.span
          className={styles.errorMessage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};