// components/ProductSelector/ProductSelector.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ProductTile } from './ProductTile';
import { 
  Package, 
  Tv, 
  Zap, 
  Box, 
  Frame, 
  Shield, 
  ShoppingCart, 
  Grid3x3 
} from 'lucide-react';
import styles from './ProductSelector.module.css';

export interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  hasGlow?: boolean;
}

interface ProductSelectorProps {
  selectedProduct: string | null;
  onSelectProduct: (productId: string) => void;
}

const products: Product[] = [
  {
    id: 'formatka',
    name: 'Formatka z plexi',
    description: 'Przycięta płyta w wybranym wymiarze i grubości',
    detailedDescription: 'Przycięta płyta z plexi, HIPS, PET-G lub PC – w wybranym wymiarze i grubości. Idealna do projektów DIY, osłon, tablic informacyjnych.',
    icon: <Package className="w-10 h-10" />,
    color: 'blue-500',
    gradient: undefined
  },
  {
    id: 'kaseton',
    name: 'Kaseton reklamowy',
    description: 'Świetlny kaseton z plexi lub dibondu',
    detailedDescription: 'Reklamowy kaseton świetlny z plexi lub dibondu, z różnymi rodzajami liter i podświetlenia. Profesjonalne rozwiązanie dla biznesu.',
    icon: <Tv className="w-10 h-10" />,
    color: 'red-500',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)'
  },
  {
    id: 'ledon',
    name: 'LEDON – Neon LED',
    description: 'Dekoracyjny neon LED na plexi',
    detailedDescription: 'Dekoracyjny neon LED na plexi – dowolny napis, kształt lub logo. Możliwość RGB, zasilania, wodoodporności. Efekt WOW gwarantowany!',
    icon: <Zap className="w-10 h-10" />,
    color: 'amber-500',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FACC15 100%)',
    hasGlow: true
  },
  {
    id: 'pojemnik',
    name: 'Pojemnik / Organizer',
    description: 'Pojemniki z przegrodami na wymiar',
    detailedDescription: 'Pojemniki i organizery z plexi z możliwością dodania przegród, wieka i personalizacji. Idealne do przechowywania i ekspozycji.',
    icon: <Box className="w-10 h-10" />,
    color: 'green-500'
  },
  {
    id: 'gablota',
    name: 'Gablota ekspozycyjna',
    description: 'Eleganckie gabloty do prezentacji',
    detailedDescription: 'Gabloty ekspozycyjne z plexi – idealne do prezentacji produktów, modeli, kolekcji. Możliwość dodania oświetlenia LED.',
    icon: <Frame className="w-10 h-10" />,
    color: 'purple-500'
  },
  {
    id: 'obudowa',
    name: 'Obudowa / Osłona',
    description: 'Osłony techniczne na wymiar',
    detailedDescription: 'Obudowy i osłony przemysłowe z plexi – od 3 do 6 ścianek. Idealne zabezpieczenie urządzeń elektronicznych i maszyn.',
    icon: <Shield className="w-10 h-10" />,
    color: 'indigo-500'
  },
  {
    id: 'impuls_kasowy',
    name: 'Impuls kasowy',
    description: 'Ekspozytor przykasowy z półkami',
    detailedDescription: 'Ekspozytor przykasowy z plexi z półkami i ogranicznikami. Zwiększ sprzedaż impulsową przy kasie!',
    icon: <ShoppingCart className="w-10 h-10" />,
    color: 'pink-500'
  },
  {
    id: 'ekspozytory',
    name: 'Ekspozytory',
    description: 'Różnorodne stojaki ekspozycyjne',
    detailedDescription: 'Profesjonalne ekspozytory z plexi – podstawkowe, schodkowe, z haczykami, kosmetyczne. Podkreśl wartość swoich produktów!',
    icon: <Grid3x3 className="w-10 h-10" />,
    color: 'teal-500'
  }
];

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  onSelectProduct
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Wybierz typ produktu
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Kliknij na kafelek, aby rozpocząć konfigurację i wycenę wybranego produktu z plexi
        </motion.p>
      </div>

      {/* Product Grid */}
      <motion.div 
        className={styles.grid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductTile
              {...product}
              isSelected={selectedProduct === product.id}
              onClick={() => onSelectProduct(product.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Selected product indicator */}
      {selectedProduct && (
        <motion.div
          className={styles.selectedIndicator}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.selectedLabel}>
            Wybrany produkt:
          </p>
          <div className={styles.selectedBadge}>
            <span className={styles.selectedName}>
              {products.find(p => p.id === selectedProduct)?.name}
            </span>
            <motion.button
              className={styles.continueButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Kontynuuj →
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};