// components/Layout/AppLayout.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProgressBar } from '../UI/ProgressBar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  progress?: number;
  offerNumber?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  progress, 
  offerNumber 
}) => {
  return (
    <div className={styles.container}>
      <Header offerNumber={offerNumber} />
      
      {progress !== undefined && (
        <ProgressBar progress={progress} />
      )}
      
      <motion.main 
        className={styles.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
};