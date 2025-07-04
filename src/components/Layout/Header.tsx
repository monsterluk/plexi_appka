// components/Layout/Header.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import styles from './Header.module.css';

interface HeaderProps {
  offerNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({ offerNumber }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <motion.div 
          className={styles.logo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/logo-plexisystem.svg" alt="PlexiSystem" />
          <span>PlexiSystem</span>
        </motion.div>
        
        {/* Numer oferty */}
        {offerNumber && (
          <motion.div 
            className={styles.offerBadge}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={styles.offerLabel}>OFERTA</span>
            <span className={styles.offerNumber}>#{offerNumber}</span>
          </motion.div>
        )}
        
        {/* Przyciski akcji */}
        <div className={styles.actions}>
          <motion.button
            className={styles.iconButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <motion.button
            className={styles.iconButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={20} />
          </motion.button>
          
          <motion.button
            className={styles.menuButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};