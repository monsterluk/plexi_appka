// components/ProductGrid/ProductGrid.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Square, 
  Box, 
  Frame, 
  Shield, 
  Zap, 
  Tv, 
  Grid3x3, 
  Layers 
} from 'lucide-react';
import styles from './ProductGrid.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const products: Product[] = [
  {
    id: 'plyta',
    name: 'Formatka',
    description: 'Płyty cięte na wymiar',
    icon: <Square size={48} />,
    color: 'var(--color-product-formatka)'
  },
  {
    id: 'pojemnik',
    name: 'Pojemnik',
    description: 'Organizery i pojemniki',
    icon: <Box size={48} />,
    color: 'var(--color-product-pojemnik)'
  },
  {
    id: 'gablota',
    name: 'Gablota',
    description: 'Gabloty ekspozycyjne',
    icon: <Frame size={48} />,
    color: 'var(--color-product-gablota)'
  },
  {
    id: 'obudowa',
    name: 'Obudowa',
    description: 'Osłony techniczne',
    icon: <Shield size={48} />,
    color: 'var(--color-product-obudowa)'
  },
  {
    id: 'ledon',
    name: 'LEDON',
    description: 'Neony LED',
    icon: <Zap size={48} />,
    color: 'var(--color-product-ledon)'
  },
  {
    id: 'kaseton',
    name: 'Kaseton',
    description: 'Kasetony reklamowe',
    icon: <Tv size={48} />,
    color: 'var(--color-product-kaseton)'
  },
  {
    id: 'ekspozytory',
    name: 'Ekspozytory',
    description: 'Stojaki ekspozycyjne',
    icon: <Grid3x3 size={48} />,
    color: 'var(--color-product-ekspozytory)'
  },
  {
    id: 'impuls_kasowy',
    name: 'Impuls kasowy',
    description: 'Ekspozytory przykasowe',
    icon: <Layers size={48} />,
    color: 'var(--color-product-impuls)'
  }
];

interface ProductGridProps {
  onProductSelect: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect }) => {
  return (
    <div className={styles.container}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Wybierz typ produktu
      </motion.h1>
      
      <div className={styles.grid}>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onProductSelect(product.id)}
            style={{ '--product-color': product.color } as React.CSSProperties}
          >
            <div className={styles.iconWrapper}>
              {product.icon}
            </div>
            <h3 className={styles.cardTitle}>{product.name}</h3>
            <p className={styles.cardDescription}>{product.description}</p>
            
            <div className={styles.cardHover}>
              <span>Kliknij aby wybrać</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};