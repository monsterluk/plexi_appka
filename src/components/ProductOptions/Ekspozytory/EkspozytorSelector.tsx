// components/ProductOptions/Ekspozytory/EkspozytorSelector.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Square, 
  Stairs, 
  Anchor, 
  Paperclip, 
  Package, 
  Sparkles 
} from 'lucide-react';
import { EkspozytorSubtype } from '../../../types/ekspozytory.types';
import { Tooltip } from '../../UI/Tooltip';
import styles from './EkspozytorSelector.module.css';

interface EkspozytorType {
  id: EkspozytorSubtype;
  name: string;
  description: string;
  icon: React.ReactNode;
  multiplier: number;
}

const ekspozytorTypes: EkspozytorType[] = [
  {
    id: 'podstawkowy',
    name: 'Podstawkowy',
    description: 'Podstawa z pionową ścianką tylną',
    icon: <Square size={32} />,
    multiplier: 2.2
  },
  {
    id: 'schodkowy',
    name: 'Schodkowy',
    description: 'Wielopoziomowy ekspozytor kaskadowy',
    icon: <Stairs size={32} />,
    multiplier: 2.5
  },
  {
    id: 'z_haczykami',
    name: 'Z haczykami',
    description: 'Płyta tylna z haczykami do zawieszania',
    icon: <Anchor size={32} />,
    multiplier: 2.4
  },
  {
    id: 'wiszacy',
    name: 'Wiszący',
    description: 'Montowany na ścianie z półkami',
    icon: <Paperclip size={32} />,
    multiplier: 2.2
  },
  {
    id: 'stojak',
    name: 'Stojak',
    description: 'Wolnostojący z plecami i opcjonalnymi półkami',
    icon: <Package size={32} />,
    multiplier: 2.5
  },
  {
    id: 'kosmetyczny',
    name: 'Kosmetyczny',
    description: 'Rozbudowany z otworami i topperem',
    icon: <Sparkles size={32} />,
    multiplier: 2.7
  }
];

interface Props {
  selectedType: EkspozytorSubtype | null;
  onSelect: (type: EkspozytorSubtype) => void;
}

export const EkspozytorSelector: React.FC<Props> = ({ selectedType, onSelect }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Wybierz typ ekspozytora</h3>
      
      <div className={styles.grid}>
        {ekspozytorTypes.map((type, index) => (
          <motion.div
            key={type.id}
            className={`${styles.card} ${selectedType === type.id ? styles.selected : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(type.id)}
          >
            <div className={styles.iconWrapper}>
              {type.icon}
            </div>
            
            <h4 className={styles.cardTitle}>{type.name}</h4>
            <p className={styles.cardDescription}>{type.description}</p>
            
            <div className={styles.multiplierBadge}>
              <Tooltip content="Mnożnik cenowy dla tego typu">
                <span>×{type.multiplier}</span>
              </Tooltip>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};