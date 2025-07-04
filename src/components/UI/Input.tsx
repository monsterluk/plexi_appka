// components/UI/Input.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  tooltip?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  tooltip,
  icon,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = React.useState(false);
  
  return (
    <motion.div 
      className={`${styles.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.labelWrapper}>
        <label className={styles.label}>
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info size={16} className={styles.infoIcon} />
          </Tooltip>
        )}
      </div>
      
      <div className={`${styles.inputWrapper} ${focused ? styles.focused : ''} ${error ? styles.error : ''}`}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
          {...props}
          className={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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
    </motion.div>
  );
};