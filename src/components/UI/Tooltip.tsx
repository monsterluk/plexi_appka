// components/UI/Tooltip.tsx

// components/UI/Tooltip.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let x = rect.left + scrollX + rect.width / 2;
      let y = rect.top + scrollY;

      switch (position) {
        case 'bottom':
          y = rect.bottom + scrollY + 8;
          break;
        case 'left':
          x = rect.left + scrollX - 8;
          y = rect.top + scrollY + rect.height / 2;
          break;
        case 'right':
          x = rect.right + scrollX + 8;
          y = rect.top + scrollY + rect.height / 2;
          break;
        default: // top
          y = rect.top + scrollY - 8;
      }

      setCoords({ x, y });
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const tooltipVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              fixed z-[9999] px-3 py-2
              bg-gray-900 dark:bg-gray-700
              text-white text-sm
              rounded-lg shadow-xl
              pointer-events-none
              max-w-xs
              ${position === 'top' || position === 'bottom' ? '-translate-x-1/2' : ''}
              ${position === 'left' || position === 'right' ? '-translate-y-1/2' : ''}
            `}
            style={{
              left: position === 'left' || position === 'right' ? 
                (position === 'left' ? coords.x - 8 : coords.x) : 
                coords.x,
              top: position === 'top' || position === 'bottom' ? 
                (position === 'top' ? coords.y - 40 : coords.y) : 
                coords.y,
              transformOrigin: position === 'top' ? 'bottom center' :
                              position === 'bottom' ? 'top center' :
                              position === 'left' ? 'right center' :
                              'left center'
            }}
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
          >
            {content}
            
            {/* Arrow */}
            <div
              className={`
                absolute w-0 h-0
                border-solid
                ${position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent border-t-gray-900 dark:border-t-gray-700' : ''}
                ${position === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent border-b-gray-900 dark:border-b-gray-700' : ''}
                ${position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent border-l-gray-900 dark:border-l-gray-700' : ''}
                ${position === 'right' ? 'left-[-8px] top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent border-r-gray-900 dark:border-r-gray-700' : ''}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};