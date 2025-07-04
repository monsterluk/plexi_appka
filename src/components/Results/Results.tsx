// components/Results/Results.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '../../store/calculatorStore';
import { 
  Package, 
  Scale, 
  DollarSign, 
  FileText,
  Zap,
  Droplets,
  Palette
} from 'lucide-react';

export const Results: React.FC = () => {
  const { currentProduct, formatka, kaseton, ledon } = useCalculatorStore();
  
  const getResult = () => {
    switch (currentProduct) {
      case 'formatka': return formatka;
      case 'kaseton': return kaseton;
      case 'ledon': return ledon;
      default: return null;
    }
  };

  const result = getResult();

  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Wprowadź dane produktu, aby zobaczyć wycenę
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals).replace('.', ',');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Nagłówek */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Podsumowanie wyceny</h2>
        <p className="text-blue-100">
          {currentProduct === 'formatka' && 'Formatka z plexi'}
          {currentProduct === 'kaseton' && 'Kaseton reklamowy'}
          {currentProduct === 'ledon' && 'LEDON – Neon LED'}
        </p>
      </div>

      {/* Główne metryki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Powierzchnia */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(result.surface, 3)} m²
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powierzchnia całkowita
          </p>
        </motion.div>

        {/* Waga */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Scale className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(result.weight, 1)} kg
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Waga produktu
          </p>
        </motion.div>

        {/* Cena całkowita */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(result.totalCost)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cena netto
          </p>
        </motion.div>
      </div>

      {/* Szczegółowa kalkulacja */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Szczegółowa kalkulacja
        </h3>
        
        <div className="space-y-3">
          {/* Koszt materiału */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Koszt materiału</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(result.materialCost)}
            </span>
          </div>

          {/* Koszty dodatków */}
          {result.addonsCost !== undefined && result.addonsCost > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Usługi dodatkowe</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(result.addonsCost)}
              </span>
            </div>
          )}

          {/* Breakdown szczegółów */}
          {result.breakdown && Object.keys(result.breakdown).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Szczegóły:
              </p>
              {Object.entries(result.breakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Suma końcowa */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300 dark:border-gray-600">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Razem netto
            </span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(result.totalCost)}
            </span>
          </div>

          {/* VAT */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">VAT (23%)</span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(result.totalCost * 0.23)}
            </span>
          </div>

          {/* Brutto */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Razem brutto
            </span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(result.totalCost * 1.23)}
            </span>
          </div>
        </div>
      </div>

      {/* Przyciski akcji */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="w-5 h-5" />
          Generuj PDF
        </motion.button>
        
        <motion.button
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Zapisz ofertę
        </motion.button>
      </div>
    </motion.div>
  );
};