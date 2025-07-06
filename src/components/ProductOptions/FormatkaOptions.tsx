// components/ProductOptions/FormatkaOptions.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FormatkaOptions as FormatkaOptionsType } from '../../types/product.types';
import { Package, Ruler, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';
import { useCalculation } from '../../hooks/useCalculation';
import { calculateFormatka } from '../../calculators/formatkaCalculator';
import { useCalculatorStore } from '../../store/calculatorStore';

interface FormatkaOptionsProps {
  onOptionsChange: (options: FormatkaOptionsType) => void;
  initialOptions?: Partial<FormatkaOptionsType>;
}

export const FormatkaOptions: React.FC<FormatkaOptionsProps> = ({
  onOptionsChange,
  initialOptions
}) => {
  const [options, setOptions] = useState<FormatkaOptionsType>({
    material: initialOptions?.material || 'plexi',
    thickness: initialOptions?.thickness || 3,
    width: initialOptions?.width || 1000,
    height: initialOptions?.height || 500,
    quantity: initialOptions?.quantity || 1,
    finishing: {
      polishedEdges: initialOptions?.finishing?.polishedEdges || false,
      roundedCorners: initialOptions?.finishing?.roundedCorners || false,
      drillHoles: initialOptions?.finishing?.drillHoles || 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setCurrentProduct } = useCalculatorStore();

  // Ustaw aktualny produkt
  useEffect(() => {
    setCurrentProduct('formatka');
  }, [setCurrentProduct]);

  // Automatyczne kalkulacje przy zmianach
  useCalculation('formatka', options, calculateFormatka);

  const validateOptions = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if ((options.width ?? 0) < 10 || (options.width ?? 0) > 3000) {
      newErrors.width = 'Szerokość musi być między 10-3000 mm';
    }
    if ((options.height ?? 0) < 10 || (options.height ?? 0) > 3000) {
      newErrors.height = 'Wysokość musi być między 10-3000 mm';
    }
    if ((options.thickness ?? 0) < 1 || (options.thickness ?? 0) > 20) {
      newErrors.thickness = 'Grubość musi być między 1-20 mm';
    }

    setErrors(newErrors);
  }, [options.width, options.height, options.thickness]);

  useEffect(() => {
    validateOptions();
  }, [validateOptions]);

  useEffect(() => {
    onOptionsChange(options);
  }, [options]); // Celowo pomijamy onOptionsChange aby uniknąć nieskończonej pętli

  const updateOption = (key: keyof FormatkaOptionsType, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateFinishing = (key: keyof FormatkaOptionsType['finishing'], value: any) => {
    setOptions(prev => ({
      ...prev,
      finishing: { ...prev.finishing, [key]: value }
    }));
  };

  const materials = [
    { value: 'plexi', label: 'Plexi (PMMA)', description: 'Standardowa, przezroczysta' },
    { value: 'hips', label: 'HIPS', description: 'Lekka, matowa' },
    { value: 'petg', label: 'PET-G', description: 'Odporna na uderzenia' },
    { value: 'pc', label: 'Poliwęglan', description: 'Najwyższa wytrzymałość' }
  ];

  const thicknesses = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Package className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Formatka z plexi
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Skonfiguruj wymiary i wykończenie płyty
            </p>
          </div>
        </div>
      </div>

      {/* Material Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Materiał
          </h3>
          <Tooltip content="Wybierz rodzaj tworzywa do Twojego projektu">
            <AlertCircle className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {materials.map(material => (
            <motion.label
              key={material.value}
              className={`
                relative flex items-start p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${options.material === material.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="material"
                value={material.value}
                checked={options.material === material.value}
                onChange={(e) => updateOption('material', e.target.value as any)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`
                    text-sm font-medium
                    ${options.material === material.value 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                    }
                  `}>
                    {material.label}
                  </span>
                </div>
                <span className={`
                  text-xs
                  ${options.material === material.value 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {material.description}
                </span>
              </div>
              {options.material === material.value && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.label>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Wymiary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Szerokość (mm)
            </label>
            <input
              type="number"
              value={options.width}
              onChange={(e) => updateOption('width', parseInt(e.target.value) || 0)}
              className={`
                w-full px-4 py-2 rounded-lg border-2
                ${errors.width 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none transition-colors
              `}
              min="10"
              max="3000"
            />
            {errors.width && (
              <p className="mt-1 text-xs text-red-500">{errors.width}</p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wysokość (mm)
            </label>
            <input
              type="number"
              value={options.height}
              onChange={(e) => updateOption('height', parseInt(e.target.value) || 0)}
              className={`
                w-full px-4 py-2 rounded-lg border-2
                ${errors.height 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none transition-colors
              `}
              min="10"
              max="3000"
            />
            {errors.height && (
              <p className="mt-1 text-xs text-red-500">{errors.height}</p>
            )}
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grubość (mm)
            </label>
            <select
              value={options.thickness}
              onChange={(e) => updateOption('thickness', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:outline-none transition-colors"
            >
              {thicknesses.map(t => (
                <option key={t} value={t}>{t} mm</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <svg viewBox="0 0 400 300" className="w-full h-48">
            <motion.rect
              x="50"
              y="50"
              width={300 * ((options.width ?? 100) / Math.max(options.width ?? 100, options.height ?? 100))}
              height={200 * ((options.height ?? 100) / Math.max(options.width ?? 100, options.height ?? 100))}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            <text x="200" y="270" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400 text-sm">
              {options.width} × {options.height} × {options.thickness} mm
            </text>
          </svg>
        </div>
      </div>

      {/* Finishing Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Wykończenie
          </h3>
        </div>

        <div className="space-y-4">
          {/* Polished Edges */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.finishing.polishedEdges}
              onChange={(e) => updateFinishing('polishedEdges', e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                Polerowane krawędzie
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kryształowo czyste, błyszczące krawędzie
              </p>
            </div>
          </label>

          {/* Rounded Corners */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.finishing.roundedCorners}
              onChange={(e) => updateFinishing('roundedCorners', e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                Zaokrąglone narożniki
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bezpieczne, estetyczne narożniki R5
              </p>
            </div>
          </label>

          {/* Drill Holes */}
          <div>
            <label className="block font-medium text-gray-900 dark:text-white mb-2">
              Otwory montażowe
            </label>
            <input
              type="number"
              value={options.finishing?.drillHoles || 0}
              onChange={(e) => updateFinishing('drillHoles' as any, parseInt(e.target.value) || 0)}
              className="w-32 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:outline-none transition-colors"
              min="0"
              max="50"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">szt.</span>
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <label className="block font-medium text-gray-900 dark:text-white mb-2">
          Ilość sztuk
        </label>
        <input
          type="number"
          value={options.quantity}
          onChange={(e) => updateOption('quantity', parseInt(e.target.value) || 1)}
          className="w-32 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:border-blue-500 focus:outline-none transition-colors"
          min="1"
          max="1000"
        />
      </div>
    </motion.div>
  );
};