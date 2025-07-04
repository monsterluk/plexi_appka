// components/ProductOptions/LedonOptions.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LedonOptions as LedonOptionsType } from '../../types/product.types';
import { Zap, Type, Palette, Droplets, Wifi, Monitor } from 'lucide-react';

interface LedonOptionsProps {
  onOptionsChange: (options: LedonOptionsType) => void;
  initialOptions?: Partial<LedonOptionsType>;
}

export const LedonOptions: React.FC<LedonOptionsProps> = ({
  onOptionsChange,
  initialOptions
}) => {
  const [options, setOptions] = useState<LedonOptionsType>({
    text: initialOptions?.text || 'OPEN',
    fontStyle: initialOptions?.fontStyle || 'standard',
    size: {
      width: initialOptions?.size?.width || 600,
      height: initialOptions?.size?.height || 200
    },
    plexiType: initialOptions?.plexiType || 'clear',
    ledColor: initialOptions?.ledColor || 'white',
    features: {
      waterproof: initialOptions?.features?.waterproof || false,
      dimmer: initialOptions?.features?.dimmer || false,
      remoteControl: initialOptions?.features?.remoteControl || false,
      mounting: initialOptions?.features?.mounting || 'wall'
    },
    quantity: initialOptions?.quantity || 1
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    onOptionsChange(options);
  }, [options]);

  const updateOption = (key: keyof LedonOptionsType, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateSize = (key: keyof LedonOptionsType['size'], value: number) => {
    setOptions(prev => ({
      ...prev,
      size: { ...prev.size, [key]: value }
    }));
  };

  const updateFeature = (key: keyof LedonOptionsType['features'], value: any) => {
    setOptions(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value }
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
      {/* Header with glow effect */}
      <div className="relative bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <motion.div 
            className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg shadow-amber-500/50"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(245, 158, 11, 0.5)',
                '0 0 40px rgba(245, 158, 11, 0.8)',
                '0 0 20px rgba(245, 158, 11, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              LEDON – Neon LED
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Świecący napis z efektem neonowym
            </p>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tekst neonu
          </h3>
        </div>

        <input
          type="text"
          value={options.text}
          onChange={(e) => updateOption('text', e.target.value)}
          placeholder="Wpisz swój tekst..."
          className="w-full px-4 py-3 text-xl rounded-lg border-2 border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:border-amber-500 focus:outline-none transition-colors"
        />

        {/* Font Style */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { value: 'standard', label: 'Standard' },
            { value: 'script', label: 'Script' },
            { value: 'bold', label: 'Bold' },
            { value: 'custom', label: 'Własny' }
          ].map(font => (
            <button
              key={font.value}
              onClick={() => updateOption('fontStyle', font.value as any)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all
                ${options.fontStyle === font.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      {/* LED Color */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kolor świecenia
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: 'white', label: 'Biały', color: 'bg-gray-100' },
            { value: 'warm', label: 'Ciepły', color: 'bg-amber-100' },
            { value: 'rgb', label: 'RGB', color: 'bg-gradient-to-r from-red-400 via-green-400 to-blue-400' },
            { value: 'custom', label: 'Własny', color: 'bg-gradient-to-r from-purple-400 to-pink-400' }
          ].map(led => (
            <motion.label
              key={led.value}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer
                ${options.ledColor === led.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                value={led.value}
                checked={options.ledColor === led.value}
                onChange={(e) => updateOption('ledColor', e.target.value as any)}
                className="sr-only"
              />
              <div className={`w-12 h-12 rounded-full ${led.color}`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {led.label}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Funkcje dodatkowe
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={options.features.waterproof}
              onChange={(e) => updateFeature('waterproof', e.target.checked)}
              className="w-5 h-5 text-amber-500 rounded"
            />
            <Droplets className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                Wodoodporność IP65
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Do użytku zewnętrznego (+20%)
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={options.features.dimmer}
              onChange={(e) => updateFeature('dimmer', e.target.checked)}
              className="w-5 h-5 text-amber-500 rounded"
            />
            <Monitor className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                Ściemniacz
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regulacja jasności świecenia
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={options.features.remoteControl}
              onChange={(e) => updateFeature('remoteControl', e.target.checked)}
              className="w-5 h-5 text-amber-500 rounded"
            />
            <Wifi className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                Pilot zdalnego sterowania
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Włącz/wyłącz, zmiana kolorów (RGB)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Podgląd na żywo
        </h3>
        <div className="relative flex items-center justify-center p-8">
          <motion.div
            className="relative"
            animate={isAnimating ? {
              filter: [
                'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))',
                'drop-shadow(0 0 30px rgba(245, 158, 11, 1))',
                'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`
              px-8 py-4 rounded-lg
              ${options.plexiType === 'clear' ? 'bg-white/10' : 
                options.plexiType === 'milky' ? 'bg-white/30' : 'bg-black/50'}
              backdrop-blur-sm border-2 border-white/20
            `}>
              <span className={`
                text-4xl font-bold
                ${options.fontStyle === 'script' ? 'font-serif italic' : 
                  options.fontStyle === 'bold' ? 'font-black' : 'font-sans'}
                ${options.ledColor === 'white' ? 'text-white' :
                  options.ledColor === 'warm' ? 'text-amber-200' :
                  options.ledColor === 'rgb' ? 'bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent' :
                  'text-purple-400'}
              `}>
                {options.text || 'NEON'}
              </span>
            </div>
          </motion.div>
          
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="absolute bottom-0 right-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 
                     text-white rounded-lg transition-colors"
          >
            {isAnimating ? 'Wyłącz' : 'Włącz'} podświetlenie
          </button>
        </div>
      </div>
    </motion.div>
  );
};