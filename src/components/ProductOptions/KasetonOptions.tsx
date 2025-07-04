// components/ProductOptions/KasetonOptions.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KasetonOptions as KasetonOptionsType } from '../../types/product.types';
import { Tv, Zap, Type, Palette } from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';

interface KasetonOptionsProps {
  onOptionsChange: (options: KasetonOptionsType) => void;
  initialOptions?: Partial<KasetonOptionsType>;
}

export const KasetonOptions: React.FC<KasetonOptionsProps> = ({
  onOptionsChange,
  initialOptions
}) => {
  const [options, setOptions] = useState<KasetonOptionsType>({
    type: initialOptions?.type || 'plexi',
    width: initialOptions?.width || 1000,
    height: initialOptions?.height || 600,
    depth: initialOptions?.depth || 100,
    letterType: initialOptions?.letterType || 'podklejone',
    lighting: {
      type: initialOptions?.lighting?.type || 'led',
      power: initialOptions?.lighting?.power || 50
    },
    graphics: initialOptions?.graphics || false,
    quantity: initialOptions?.quantity || 1
  });

  useEffect(() => {
    onOptionsChange(options);
  }, [options]);

  const updateOption = (key: keyof KasetonOptionsType, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateLighting = (key: keyof KasetonOptionsType['lighting'], value: any) => {
    setOptions(prev => ({
      ...prev,
      lighting: { ...prev.lighting, [key]: value }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 dark:from-red-500/20 dark:to-red-600/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kaseton reklamowy
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Świetlna reklama dla Twojego biznesu
            </p>
          </div>
        </div>
      </div>

      {/* Kaseton Type */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rodzaj kasetonu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'plexi', label: 'Kaseton z plexi', desc: 'Lekki, przezroczysty' },
            { value: 'dibond', label: 'Kaseton z dibondu', desc: 'Trwały, elegancki' }
          ].map(type => (
            <motion.label
              key={type.value}
              className={`
                relative flex items-start p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${options.type === type.value 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                value={type.value}
                checked={options.type === type.value}
                onChange={(e) => updateOption('type', e.target.value)}
                className="sr-only"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {type.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {type.desc}
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Letter Type */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rodzaj liter
          </h3>
          <Tooltip content="Sposób montażu i podświetlenia napisów">
            <span className="text-gray-400">?</span>
          </Tooltip>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'podklejone', label: 'Podklejone', price: '0 zł/m²' },
            { value: 'zlicowane', label: 'Zlicowane', price: '+150 zł/m²' },
            { value: 'wystajace', label: 'Wystające', price: '+400 zł/m²' },
            { value: 'halo', label: 'Efekt halo', price: '+300 zł/m²' }
          ].map(letter => (
            <label
              key={letter.value}
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer
                ${options.letterType === letter.value 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
            >
              <input
                type="radio"
                value={letter.value}
                checked={options.letterType === letter.value}
                onChange={(e) => updateOption('letterType', e.target.value as any)}
                className="sr-only"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {letter.label}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {letter.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Lighting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Oświetlenie
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Typ oświetlenia
            </label>
            <select
              value={options.lighting.type}
              onChange={(e) => updateLighting('type', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="none">Brak oświetlenia</option>
              <option value="led">LED</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          {options.lighting.type !== 'none' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Moc oświetlenia (W)
              </label>
              <input
                type="number"
                value={options.lighting.power}
                onChange={(e) => updateLighting('power', parseInt(e.target.value))}
                className="w-32 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="10"
                max="500"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Graphics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Grafika
          </h3>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.graphics}
            onChange={(e) => updateOption('graphics', e.target.checked)}
            className="w-5 h-5 text-red-500 rounded"
          />
          <span className="font-medium text-gray-900 dark:text-white">
            Dodaj grafikę na front kasetonu
          </span>
        </label>
      </div>

      {/* Dimensions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wymiary kasetonu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Szerokość (mm)
            </label>
            <input
              type="number"
              value={options.width}
              onChange={(e) => updateOption('width', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="200"
              max="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wysokość (mm)
            </label>
            <input
              type="number"
              value={options.height}
              onChange={(e) => updateOption('height', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="200"
              max="3000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Głębokość (mm)
            </label>
            <input
              type="number"
              value={options.depth}
              onChange={(e) => updateOption('depth', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="50"
              max="300"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};