// components/Layout/Footer.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Dane kontaktowe */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Kontakt</h4>
            <div className={styles.contactInfo}>
              <a href="tel:+48123456789" className={styles.contactItem}>
                <Phone size={16} />
                <span>+48 123 456 789</span>
              </a>
              <a href="mailto:biuro@plexisystem.pl" className={styles.contactItem}>
                <Mail size={16} />
                <span>biuro@plexisystem.pl</span>
              </a>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>ul. Przemysłowa 10, 00-123 Warszawa</span>
              </div>
            </div>
          </div>
          
          {/* Linki */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Informacje</h4>
            <div className={styles.links}>
              <a href="/privacy" className={styles.link}>
                Polityka prywatności
              </a>
              <a href="/terms" className={styles.link}>
                Regulamin
              </a>
              <a href="/about" className={styles.link}>
                O nas
              </a>
            </div>
          </div>
          
          {/* Branding */}
          <div className={styles.branding}>
            <motion.p 
              className={styles.madeWith}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Made with <Heart size={16} className={styles.heart} /> by PlexiSystem
            </motion.p>
            <p className={styles.version}>v1.3.5</p>
          </div>
        </div>
      </div>
    </footer>
  );
};