import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Frame, 
  Box, 
  Monitor, 
  Square, 
  Layers,
  Grid3x3,
  Minus,
  Plus,
  Home,
  Sparkles,
  FileText,
  Save,
  Calculator,
  User,
  X,
  Search,
  Eye,
  History,
  Download,
  Truck,
  BarChart
} from 'lucide-react';

// Dane materiałów
const materials = [
  { id: 1, name: 'PET-G / Plexi bezbarwna', pricePerM2: 30, density: 1190, thicknesses: [1,2,3,4,5,6,8,10,12,15,20] },
  { id: 2, name: 'PET-G / Plexi mleczna', pricePerM2: 32, density: 1190, thicknesses: [1,2,3,4,5,6,8,10,12,15,20] },
  { id: 3, name: 'PET-G / Plexi kolorowa', pricePerM2: 35, density: 1190, thicknesses: [1,2,3,4,5,6,8,10,12,15,20] },
  { id: 4, name: 'Poliwęglan bezbarwny', pricePerM2: 45, density: 1200, thicknesses: [2,3,4,5,6,8,10,12,15,20] },
  { id: 5, name: 'Poliwęglan mleczny', pricePerM2: 47, density: 1200, thicknesses: [2,3,4,5,6,8,10,12,15,20] },
  { id: 6, name: 'Dibond', pricePerM2: 55, density: 1500, thicknesses: [3,4,6] }
];

// Kalkulator główny
const calculateProduct = (dimensions, options, material, thickness, quantity, productType) => {
  const { width, height, depth = 0 } = dimensions;
  let surface = 0;
  let components = [];
  
  // Obliczanie powierzchni według typu produktu
  switch(productType) {
    case 'impuls-kasowy':
      const shelvesCount = options.shelvesCount || 3;
      // Plecy
      surface += (width * height) / 1e6;
      components.push({ name: 'Plecy', surface: (width * height) / 1e6 });
      // Boki
      surface += 2 * (depth * height) / 1e6;
      components.push({ name: 'Boki (2x)', surface: 2 * (depth * height) / 1e6 });
      // Półki
      surface += shelvesCount * (width * depth) / 1e6;
      components.push({ name: `Półki (${shelvesCount}x)`, surface: shelvesCount * (width * depth) / 1e6 });
      break;
      
    case 'pojemnik':
      // Dno
      surface += (width * depth) / 1e6;
      components.push({ name: 'Dno', surface: (width * depth) / 1e6 });
      // Ściany
      surface += 2 * (width * height) / 1e6;
      surface += 2 * (depth * height) / 1e6;
      components.push({ name: 'Ściany', surface: (2 * (width * height) + 2 * (depth * height)) / 1e6 });
      // Wieko opcjonalne
      if (options.hasLid) {
        surface += (width * depth) / 1e6;
        components.push({ name: 'Wieko', surface: (width * depth) / 1e6 });
      }
      break;
      
    case 'formatka':
      surface = (width * height) / 1e6;
      components.push({ name: 'Formatka', surface: (width * height) / 1e6 });
      break;
      
    default:
      // Domyślnie prostokąt
      surface = (width * height) / 1e6;
      components.push({ name: 'Element', surface: (width * height) / 1e6 });
  }
  
  // Obliczenia
  const totalSurface = surface * quantity;
  const surfaceWithWaste = totalSurface * 1.1; // 10% odpadu
  const weight = surface * (thickness / 1000) * material.density; // kg na sztukę
  const totalWeight = weight * quantity;
  
  // Koszty
  const materialCost = surfaceWithWaste * material.pricePerM2 * thickness * 1.8; // mnożnik 1.8
  
  // Obliczenia logistyczne
  const boxCapacity = Math.floor(50 / weight); // zakładamy max 50kg na karton
  const boxesNeeded = Math.ceil(quantity / boxCapacity);
  const palletCapacity = Math.floor(800 / totalWeight) * quantity; // max 800kg na paletę
  const palletsNeeded = Math.ceil(quantity / palletCapacity);
  
  return {
    surface,
    totalSurface,
    surfaceWithWaste,
    weight,
    totalWeight,
    materialCost,
    totalCost: materialCost,
    components,
    logistics: {
      boxCapacity,
      boxesNeeded,
      palletCapacity,
      palletsNeeded,
      weightPerBox: Math.min(weight * boxCapacity, 50)
    }
  };
};

// Generator numerów ofert
const generateOfferNumber = (salesmanInitials = 'JK') => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const offerCount = parseInt(localStorage.getItem(`offerCount_${year}_${month}`) || '0') + 1;
  localStorage.setItem(`offerCount_${year}_${month}`, offerCount.toString());
  return `${salesmanInitials}/${year}/${month}/${String(offerCount).padStart(3, '0')}`;
};

// Komponenty UI
const ProductCard = ({ product, isSelected, onClick }) => {
  const Icon = product.icon;
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg cursor-pointer transition-all text-center
        ${isSelected 
          ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-xl scale-105' 
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
        }
      `}
    >
      <Icon size={32} className="mx-auto mb-2" />
      <p className="text-sm font-bold">{product.name}</p>
    </div>
  );
};

const NumberInput = ({ label, value, onChange, min = 0, max = 9999, unit = 'mm' }) => {
  return (
    <div className="flex-1">
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 10))}
          className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center"
        >
          <Minus size={20} />
        </button>
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-24 px-2 py-2 text-center bg-gray-700 text-white rounded"
          />
          <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {unit}
          </span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 10))}
          className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

const CheckboxOption = ({ label, checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`
        p-3 rounded cursor-pointer transition-all
        ${checked ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
      `}
    >
      <div className="flex items-center">
        <div className="w-5 h-5 mr-2">
          {checked && (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

// Główny komponent
export default function PlexiCalculator() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(1);
  const [thickness, setThickness] = useState(3);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400, depth: 300 });
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState({
    shelvesCount: 3,
    hasLid: false,
    hasPartitions: false
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  const products = [
    { id: 'pojemnik', name: 'Pojemnik', icon: Package },
    { id: 'gablota', name: 'Gablota', icon: Frame },
    { id: 'kaseton', name: 'Kaseton', icon: Box },
    { id: 'display', name: 'Display', icon: Monitor },
    { id: 'formatka', name: 'Formatka', icon: Square },
    { id: 'ledon', name: 'Ledon', icon: Sparkles },
    { id: 'ekspozytory', name: 'Ekspozytory', icon: Layers },
    { id: 'impuls-kasowy', name: 'Impuls Kasowy', icon: Grid3x3 },
    { id: 'obudowa', name: 'Obudowa', icon: Home }
  ];

  // Obliczenia
  useEffect(() => {
    if (selectedProduct && selectedMaterial) {
      const material = materials.find(m => m.id === selectedMaterial);
      const result = calculateProduct(dimensions, options, material, thickness, quantity, selectedProduct.id);
      setCalculationResult(result);
    }
  }, [selectedProduct, selectedMaterial, thickness, dimensions, quantity, options]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Nagłówek */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Kalkulator PlexiSystem
          </h1>
          <button 
            onClick={() => setShowCustomerForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg flex items-center gap-2"
          >
            <User size={20} />
            Dane klienta
          </button>
        </div>

        {/* Wybór produktu */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">1. Wybierz produkt</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>

        {selectedProduct && (
          <>
            {/* Materiał i grubość */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">2. Materiał i grubość</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {materials.map(material => (
                  <div
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`
                      p-3 rounded cursor-pointer transition-all
                      ${selectedMaterial === material.id
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }
                    `}
                  >
                    <div className="text-sm font-semibold">{material.name}</div>
                    <div className="text-xs opacity-80">{material.pricePerM2} zł/m²</div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-gray-300">Grubość:</span>
                {materials.find(m => m.id === selectedMaterial)?.thicknesses.map(t => (
                  <button
                    key={t}
                    onClick={() => setThickness(t)}
                    className={`px-3 py-1 rounded text-sm ${
                      thickness === t 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {t}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Wymiary */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">3. Wymiary i ilość</h2>
              <div className="flex flex-wrap gap-6">
                <NumberInput
                  label="Szerokość"
                  value={dimensions.width}
                  onChange={(v) => setDimensions({...dimensions, width: v})}
                />
                <NumberInput
                  label="Wysokość"
                  value={dimensions.height}
                  onChange={(v) => setDimensions({...dimensions, height: v})}
                />
                {['pojemnik', 'gablota', 'obudowa', 'impuls-kasowy'].includes(selectedProduct.id) && (
                  <NumberInput
                    label="Głębokość"
                    value={dimensions.depth}
                    onChange={(v) => setDimensions({...dimensions, depth: v})}
                  />
                )}
                <NumberInput
                  label="Ilość"
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={999}
                  unit="szt"
                />
              </div>
            </div>

            {/* Opcje */}
            {selectedProduct.id === 'impuls-kasowy' && (
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">4. Opcje</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 mb-2 block">Liczba półek</label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={options.shelvesCount}
                      onChange={(e) => setOptions({...options, shelvesCount: parseInt(e.target.value) || 2})}
                      className="w-32 px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedProduct.id === 'pojemnik' && (
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">4. Opcje</h2>
                <div className="grid grid-cols-2 gap-4">
                  <CheckboxOption 
                    label="Wieko" 
                    checked={options.hasLid} 
                    onChange={(v) => setOptions({...options, hasLid: v})} 
                  />
                  <CheckboxOption 
                    label="Przegrody" 
                    checked={options.hasPartitions} 
                    onChange={(v) => setOptions({...options, hasPartitions: v})} 
                  />
                </div>
              </div>
            )}

            {/* Podsumowanie z nowymi obliczeniami */}
            {calculationResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kalkulacja finansowa */}
                <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calculator className="mr-2" />
                    Kalkulacja
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Powierzchnia 1 szt:</span>
                      <span className="font-bold">{calculationResult.surface.toFixed(3)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waga 1 szt:</span>
                      <span className="font-bold">{calculationResult.weight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Powierzchnia całkowita:</span>
                      <span className="font-bold">{calculationResult.totalSurface.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Powierzchnia z odpadem (10%):</span>
                      <span className="font-bold">{calculationResult.surfaceWithWaste.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waga całkowita:</span>
                      <span className="font-bold">{calculationResult.totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="border-t border-white/30 pt-2 mt-2">
                      <div className="flex justify-between text-xl">
                        <span>Cena netto:</span>
                        <span className="font-bold">{calculationResult.totalCost.toFixed(2)} zł</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cena brutto (23%):</span>
                        <span className="font-bold">{(calculationResult.totalCost * 1.23).toFixed(2)} zł</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistyka */}
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Truck className="mr-2" />
                    Logistyka
                  </h2>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Sztuk w kartonie:</span>
                      <span className="font-bold text-white">{calculationResult.logistics.boxCapacity} szt</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liczba kartonów:</span>
                      <span className="font-bold text-white">{calculationResult.logistics.boxesNeeded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waga kartonu:</span>
                      <span className="font-bold text-white">{calculationResult.logistics.weightPerBox.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sztuk na palecie:</span>
                      <span className="font-bold text-white">{calculationResult.logistics.palletCapacity} szt</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liczba palet:</span>
                      <span className="font-bold text-white">{calculationResult.logistics.palletsNeeded}</span>
                    </div>
                  </div>
                  
                  {/* Szczegóły powierzchni */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-sm font-semibold text-white mb-2">Komponenty:</h3>
                    <div className="space-y-1 text-sm">
                      {calculationResult.components.map((comp, idx) => (
                        <div key={idx} className="flex justify-between text-gray-400">
                          <span>{comp.name}:</span>
                          <span>{comp.surface.toFixed(3)} m²</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal formularza klienta */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Dane klienta</h2>
              <button 
                onClick={() => setShowCustomerForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="NIP"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
              <input
                type="text"
                placeholder="Nazwa firmy"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Adres"
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Miasto"
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => {
                    setCustomerData({company: 'Test Sp. z o.o.'});
                    setShowCustomerForm(false);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}