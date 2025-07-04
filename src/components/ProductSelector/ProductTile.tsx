// components/ProductSelector/ProductTile.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';

interface ProductTileProps {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  isSelected: boolean;
  hasGlow?: boolean;
  onClick: () => void;
}

export const ProductTile: React.FC<ProductTileProps> = ({
  id,
  name,
  description,
  detailedDescription,
  icon,
  color,
  gradient,
  isSelected,
  hasGlow = false,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      className={`
        relative group cursor-pointer
        ${isSelected ? 'ring-4 ring-offset-4' : ''}
        ${isSelected ? `ring-${color}/50` : ''}
        dark:ring-offset-gray-900
        transition-all duration-300
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <motion.div
        className={`
          relative overflow-hidden
          bg-white dark:bg-gray-800
          rounded-2xl shadow-xl
          border-2 transition-all duration-300
          ${isSelected 
            ? gradient 
              ? 'border-transparent' 
              : `border-${color}`
            : 'border-gray-200 dark:border-gray-700'
          }
          ${!isSelected && 'hover:border-gray-300 dark:hover:border-gray-600'}
          ${hasGlow && isSelected ? 'shadow-2xl' : ''}
        `}
        style={{
          background: isSelected && gradient ? gradient : undefined,
          boxShadow: hasGlow && isSelected 
            ? `0 0 30px ${color}40, 0 0 60px ${color}20` 
            : undefined
        }}
      >
        {/* Gradient overlay for selected state */}
        {isSelected && gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        )}

        {/* Content container */}
        <div className={`
          relative p-8
          ${isSelected && gradient ? 'text-white' : 'text-gray-900 dark:text-white'}
        `}>
          {/* Icon */}
          <motion.div
            className="mb-6"
            animate={{
              rotate: isSelected ? [0, -10, 10, -10, 0] : 0,
              scale: isSelected ? 1.1 : 1
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
          >
            <div className={`
              w-20 h-20 mx-auto
              rounded-2xl
              flex items-center justify-center
              text-4xl
              ${isSelected && gradient
                ? 'bg-white/20 backdrop-blur-sm'
                : `bg-${color}/10`
              }
              ${!isSelected && `group-hover:bg-${color}/20`}
              transition-all duration-300
            `}>
              {icon}
            </div>
          </motion.div>

          {/* Title with tooltip trigger */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className={`
              text-xl font-bold
              ${isSelected && gradient 
                ? 'text-white' 
                : 'text-gray-900 dark:text-white'
              }
            `}>
              {name}
            </h3>
            
            <Tooltip content={detailedDescription}>
              <button
                className={`
                  p-1 rounded-full
                  transition-all duration-200
                  ${isSelected && gradient
                    ? 'hover:bg-white/20 text-white/70 hover:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle size={16} />
              </button>
            </Tooltip>
          </div>

          {/* Description */}
          <p className={`
            text-sm text-center
            ${isSelected && gradient
              ? 'text-white/90'
              : 'text-gray-600 dark:text-gray-400'
            }
          `}>
            {description}
          </p>

          {/* Selection indicator */}
          <motion.div
            className={`
              absolute top-4 right-4
              w-6 h-6 rounded-full
              border-2
              ${isSelected
                ? gradient
                  ? 'bg-white border-white'
                  : `bg-${color} border-${color}`
                : 'bg-transparent border-gray-300 dark:border-gray-600'
              }
              transition-all duration-300
            `}
            animate={{
              scale: isSelected ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 0.3
            }}
          >
            {isSelected && (
              <motion.svg
                className="w-full h-full p-1"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke={gradient ? color : 'white'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </motion.div>
        </div>

        {/* Hover effect gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`
          }}
        />
      </motion.div>

      {/* Floating particles for LEDON */}
      {hasGlow && isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${80}%`
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};