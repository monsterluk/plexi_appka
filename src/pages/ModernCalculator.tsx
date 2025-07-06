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
  Truck,
  Download
} from 'lucide-react';
import styles from './ModernCalculator.module.css';

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
const calculateProduct = (dimensions: any, options: any, material: any, thickness: number, quantity: number, productType: string) => {
  const { width, height, depth = 0 } = dimensions;
  let surface = 0;
  let components: any[] = [];
  
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

// Komponenty UI
const ProductCard: React.FC<{
  product: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ product, isSelected, onClick }) => {
  const Icon = product.icon;
  return (
    <div
      onClick={onClick}
      className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
    >
      <Icon size={32} className={styles.productIcon} />
      <p className={styles.productName}>{product.name}</p>
    </div>
  );
};

const NumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}> = ({ label, value, onChange, min = 0, max = 9999, unit = 'mm' }) => {
  return (
    <div className={styles.numberInput}>
      <label>{label}</label>
      <div className={styles.inputControls}>
        <button
          onClick={() => onChange(Math.max(min, value - 10))}
          className={styles.decrementBtn}
        >
          <Minus size={20} />
        </button>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          />
          <span className={styles.unit}>{unit}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 10))}
          className={styles.incrementBtn}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

const CheckboxOption: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`${styles.checkboxOption} ${checked ? styles.checked : ''}`}
    >
      <div className={styles.checkbox}>
        {checked && (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </div>
  );
};

// Główny komponent
export const ModernCalculator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(1);
  const [thickness, setThickness] = useState(3);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400, depth: 300 });
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState({
    // Wspólne opcje
    shelvesCount: 3,
    hasLid: false,
    hasPartitions: false,
    
    // Kaseton
    kasetonType: 'kaseton_plexi',
    letterType: 'litery_podklejone',
    
    // Pojemnik
    hasVentilation: false,
    hasLock: false,
    hingeType: 'zawiasy_bezbarwne',
    partitionType: 'przegrody_proste',
    partitionCount: 0,
    hasDiagonalFlap: false,
    
    // Gablota
    hasDoor: false,
    hasLED: false,
    hasAdjustableShelves: false,
    baseType: 'podstawa_standard',
    
    // Obudowa
    hasCablePass: false,
    hasHandle: false,
    
    // LED-ON
    hasRGBLED: false,
    hasRemote: false,
    hasDuskSensor: false,
    hasSolarPower: false,
    ledType: 'led_standard',
    projectType: 'projekt_brak',
    hasWaterproof: false,
    hasMountingPower: false,
    
    // Ekspozytory
    levelsCount: 3,
    hasWheels: false,
    hasSideWalls: false,
    ekspozytorType: 'podstawkowy',
    hasTopper: false,
    hasGraphics: false,
    hasClosable: false,
    hasLEDLighting: false,
    hasPolishedEdges: false,
    hasUnitCarton: false,
    hooksCount: 0,
    
    // Impuls kasowy
    hasLimiters: true,
    limiterHeight: 60,
    
    // Formatka
    hasPolishedEdges: false,
    hasMountingHoles: false,
    hasRoundedCorners: false,
    hasEngraving: false,
    
    // Display
    hasRotatingBase: false,
    hasLighting: false,
    hasMirror: false,
    
    // Dodatkowe usługi
    hasDrilling: false,
    drillingCount: 0,
    hasChamfering: false,
    chamferingLength: 0,
    hasEdgePolishing: false,
    edgePolishingLength: 0,
    hasLatexGraphics: false,
    latexGraphicsArea: 0,
    hasEngraving: false,
    engravingHours: 0
  });
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Nagłówek */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Kalkulator PlexiSystem
          </h1>
          <button 
            onClick={() => setShowCustomerForm(true)}
            className={styles.customerBtn}
          >
            <User size={20} />
            Dane klienta
          </button>
        </div>

        {/* Wybór produktu */}
        <div className={styles.section}>
          <h2>1. Wybierz produkt</h2>
          <div className={styles.productGrid}>
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
            <div className={styles.section}>
              <h2>2. Materiał i grubość</h2>
              <div className={styles.materialGrid}>
                {materials.map(material => (
                  <div
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`${styles.materialCard} ${
                      selectedMaterial === material.id ? styles.selected : ''
                    }`}
                  >
                    <div className={styles.materialName}>{material.name}</div>
                    <div className={styles.materialPrice}>{material.pricePerM2} zł/m²</div>
                  </div>
                ))}
              </div>
              
              <div className={styles.thicknessSelector}>
                <span>Grubość:</span>
                {materials.find(m => m.id === selectedMaterial)?.thicknesses.map(t => (
                  <button
                    key={t}
                    onClick={() => setThickness(t)}
                    className={`${styles.thicknessBtn} ${
                      thickness === t ? styles.selected : ''
                    }`}
                  >
                    {t}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Wymiary */}
            <div className={styles.section}>
              <h2>3. Wymiary i ilość</h2>
              <div className={styles.dimensionsGrid}>
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

            {/* Opcje dla każdego produktu */}
            <div className={styles.section}>
              <h2>4. Opcje</h2>
              
              {selectedProduct.id === 'impuls-kasowy' && (
                <div className={styles.optionsGrid}>
                  <div>
                    <label>Liczba półek</label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={options.shelvesCount}
                      onChange={(e) => setOptions({...options, shelvesCount: parseInt(e.target.value) || 2})}
                      className={styles.shelvesInput}
                    />
                  </div>
                  <CheckboxOption 
                    label="Ograniczniki na półkach" 
                    checked={options.hasLimiters || false} 
                    onChange={(v) => setOptions({...options, hasLimiters: v})} 
                  />
                  <CheckboxOption 
                    label="Grafika na plecach" 
                    checked={options.hasGraphics || false} 
                    onChange={(v) => setOptions({...options, hasGraphics: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'pojemnik' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Typ zawiasów:</label>
                    <select 
                      value={options.hingeType} 
                      onChange={(e) => setOptions({...options, hingeType: e.target.value})}
                      className={styles.select}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="zawiasy_bezbarwne">Zawias bezbarwny (7 zł/szt)</option>
                      <option value="zawiasy_nierdzewne">Zawias nierdzewny (9 zł/szt)</option>
                    </select>
                  </div>
                  
                  <div className={styles.optionsGrid}>
                    <CheckboxOption 
                      label="Wieko" 
                      checked={options.hasLid} 
                      onChange={(v) => setOptions({...options, hasLid: v})} 
                    />
                    <CheckboxOption 
                      label="Zamek (11 zł/szt)" 
                      checked={options.hasLock || false} 
                      onChange={(v) => setOptions({...options, hasLock: v})} 
                    />
                    <CheckboxOption 
                      label="Otwory wentylacyjne" 
                      checked={options.hasVentilation || false} 
                      onChange={(v) => setOptions({...options, hasVentilation: v})} 
                    />
                    <CheckboxOption 
                      label="Klapka skośna (trapez)" 
                      checked={options.hasDiagonalFlap || false} 
                      onChange={(v) => setOptions({...options, hasDiagonalFlap: v})} 
                    />
                  </div>
                  
                  {options.hasPartitions && (
                    <div style={{ marginTop: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Przegrody:</label>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <select 
                          value={options.partitionType} 
                          onChange={(e) => setOptions({...options, partitionType: e.target.value})}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px' }}
                        >
                          <option value="przegrody_proste">Przegrody proste</option>
                          <option value="przegrody_kratownica">Przegrody kratownica</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={options.partitionCount}
                          onChange={(e) => setOptions({...options, partitionCount: Number(e.target.value)})}
                          placeholder="Ilość"
                          style={{ width: '100px', padding: '10px', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '20px' }}>
                    <CheckboxOption 
                      label="Przegrody" 
                      checked={options.hasPartitions} 
                      onChange={(v) => setOptions({...options, hasPartitions: v})} 
                    />
                  </div>
                </>
              )}

              {selectedProduct.id === 'gablota' && (
                <div className={styles.optionsGrid}>
                  <CheckboxOption 
                    label="Drzwiczki" 
                    checked={options.hasDoor || false} 
                    onChange={(v) => setOptions({...options, hasDoor: v})} 
                  />
                  <CheckboxOption 
                    label="Zamek" 
                    checked={options.hasLock || false} 
                    onChange={(v) => setOptions({...options, hasLock: v})} 
                  />
                  <CheckboxOption 
                    label="Oświetlenie LED" 
                    checked={options.hasLED || false} 
                    onChange={(v) => setOptions({...options, hasLED: v})} 
                  />
                  <CheckboxOption 
                    label="Półki regulowane" 
                    checked={options.hasAdjustableShelves || false} 
                    onChange={(v) => setOptions({...options, hasAdjustableShelves: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'kaseton' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Typ kasetonu:</label>
                    <select 
                      value={options.kasetonType} 
                      onChange={(e) => setOptions({...options, kasetonType: e.target.value})}
                      className={styles.select}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="kaseton_plexi">Kaseton z plexi (1550 zł/m²)</option>
                      <option value="kaseton_dibond">Kaseton z dibond (1400 zł/m²)</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Typ liter:</label>
                    <select 
                      value={options.letterType} 
                      onChange={(e) => setOptions({...options, letterType: e.target.value})}
                      className={styles.select}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="litery_podklejone">Litery podklejane (0 zł/m²)</option>
                      <option value="litery_zlicowane">Litery zlicowane (+150 zł/m²)</option>
                      <option value="litery_wystajace">Litery wystające (+400 zł/m²)</option>
                      <option value="litery_halo">Litery z efektem Halo (+300 zł/m²)</option>
                    </select>
                  </div>
                  
                  <div className={styles.optionsGrid}>
                    <CheckboxOption 
                      label="Podświetlenie LED" 
                      checked={options.hasLED || false} 
                      onChange={(v) => setOptions({...options, hasLED: v})} 
                    />
                    <CheckboxOption 
                      label="Dwustronny" 
                      checked={options.isDoubleSided || false} 
                      onChange={(v) => setOptions({...options, isDoubleSided: v})} 
                    />
                    <CheckboxOption 
                      label="Grafika" 
                      checked={options.hasGraphics || false} 
                      onChange={(v) => setOptions({...options, hasGraphics: v})} 
                    />
                    <CheckboxOption 
                      label="Montaż na wysięgniku" 
                      checked={options.hasBracket || false} 
                      onChange={(v) => setOptions({...options, hasBracket: v})} 
                    />
                  </div>
                </>
              )}

              {selectedProduct.id === 'display' && (
                <div className={styles.optionsGrid}>
                  <CheckboxOption 
                    label="Podstawa obrotowa" 
                    checked={options.hasRotatingBase || false} 
                    onChange={(v) => setOptions({...options, hasRotatingBase: v})} 
                  />
                  <CheckboxOption 
                    label="Oświetlenie" 
                    checked={options.hasLighting || false} 
                    onChange={(v) => setOptions({...options, hasLighting: v})} 
                  />
                  <CheckboxOption 
                    label="Lustro" 
                    checked={options.hasMirror || false} 
                    onChange={(v) => setOptions({...options, hasMirror: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'formatka' && (
                <div className={styles.optionsGrid}>
                  <CheckboxOption 
                    label="Szlifowane krawędzie" 
                    checked={options.hasPolishedEdges || false} 
                    onChange={(v) => setOptions({...options, hasPolishedEdges: v})} 
                  />
                  <CheckboxOption 
                    label="Otwory montażowe" 
                    checked={options.hasMountingHoles || false} 
                    onChange={(v) => setOptions({...options, hasMountingHoles: v})} 
                  />
                  <CheckboxOption 
                    label="Zaokrąglone rogi" 
                    checked={options.hasRoundedCorners || false} 
                    onChange={(v) => setOptions({...options, hasRoundedCorners: v})} 
                  />
                  <CheckboxOption 
                    label="Grawerowanie" 
                    checked={options.hasEngraving || false} 
                    onChange={(v) => setOptions({...options, hasEngraving: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'ledon' && (
                <div className={styles.optionsGrid}>
                  <CheckboxOption 
                    label="RGB LED" 
                    checked={options.hasRGBLED || false} 
                    onChange={(v) => setOptions({...options, hasRGBLED: v})} 
                  />
                  <CheckboxOption 
                    label="Pilot" 
                    checked={options.hasRemote || false} 
                    onChange={(v) => setOptions({...options, hasRemote: v})} 
                  />
                  <CheckboxOption 
                    label="Czujnik zmierzchu" 
                    checked={options.hasDuskSensor || false} 
                    onChange={(v) => setOptions({...options, hasDuskSensor: v})} 
                  />
                  <CheckboxOption 
                    label="Zasilanie solarne" 
                    checked={options.hasSolarPower || false} 
                    onChange={(v) => setOptions({...options, hasSolarPower: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'ekspozytory' && (
                <div className={styles.optionsGrid}>
                  <div>
                    <label>Liczba poziomów</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={options.levelsCount || 3}
                      onChange={(e) => setOptions({...options, levelsCount: parseInt(e.target.value) || 3})}
                      className={styles.shelvesInput}
                    />
                  </div>
                  <CheckboxOption 
                    label="Kółka" 
                    checked={options.hasWheels || false} 
                    onChange={(v) => setOptions({...options, hasWheels: v})} 
                  />
                  <CheckboxOption 
                    label="Regulowane półki" 
                    checked={options.hasAdjustableShelves || false} 
                    onChange={(v) => setOptions({...options, hasAdjustableShelves: v})} 
                  />
                  <CheckboxOption 
                    label="Ścianki boczne" 
                    checked={options.hasSideWalls || false} 
                    onChange={(v) => setOptions({...options, hasSideWalls: v})} 
                  />
                </div>
              )}

              {selectedProduct.id === 'obudowa' && (
                <div className={styles.optionsGrid}>
                  <CheckboxOption 
                    label="Wentylacja" 
                    checked={options.hasVentilation || false} 
                    onChange={(v) => setOptions({...options, hasVentilation: v})} 
                  />
                  <CheckboxOption 
                    label="Przepusty kablowe" 
                    checked={options.hasCablePass || false} 
                    onChange={(v) => setOptions({...options, hasCablePass: v})} 
                  />
                  <CheckboxOption 
                    label="Zamek" 
                    checked={options.hasLock || false} 
                    onChange={(v) => setOptions({...options, hasLock: v})} 
                  />
                  <CheckboxOption 
                    label="Uchwyt" 
                    checked={options.hasHandle || false} 
                    onChange={(v) => setOptions({...options, hasHandle: v})} 
                  />
                </div>
              )}
            </div>

            {/* Podsumowanie */}
            {calculationResult && (
              <div className={styles.resultsGrid}>
                {/* Kalkulacja finansowa */}
                <div className={styles.calculationCard}>
                  <h2>
                    <Calculator className={styles.icon} />
                    Kalkulacja
                  </h2>
                  <div className={styles.calculationDetails}>
                    <div className={styles.row}>
                      <span>Powierzchnia 1 szt:</span>
                      <span className={styles.value}>{calculationResult.surface.toFixed(3)} m²</span>
                    </div>
                    <div className={styles.row}>
                      <span>Waga 1 szt:</span>
                      <span className={styles.value}>{calculationResult.weight.toFixed(2)} kg</span>
                    </div>
                    <div className={styles.row}>
                      <span>Powierzchnia całkowita:</span>
                      <span className={styles.value}>{calculationResult.totalSurface.toFixed(2)} m²</span>
                    </div>
                    <div className={styles.row}>
                      <span>Powierzchnia z odpadem (10%):</span>
                      <span className={styles.value}>{calculationResult.surfaceWithWaste.toFixed(2)} m²</span>
                    </div>
                    <div className={styles.row}>
                      <span>Waga całkowita:</span>
                      <span className={styles.value}>{calculationResult.totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className={styles.priceSection}>
                      <div className={styles.priceRow}>
                        <span>Cena netto:</span>
                        <span className={styles.price}>{calculationResult.totalCost.toFixed(2)} zł</span>
                      </div>
                      <div className={styles.priceRow}>
                        <span>Cena brutto (23%):</span>
                        <span className={styles.price}>{(calculationResult.totalCost * 1.23).toFixed(2)} zł</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistyka */}
                <div className={styles.logisticsCard}>
                  <h2>
                    <Truck className={styles.icon} />
                    Logistyka
                  </h2>
                  <div className={styles.logisticsDetails}>
                    <div className={styles.row}>
                      <span>Sztuk w kartonie:</span>
                      <span className={styles.value}>{calculationResult.logistics.boxCapacity} szt</span>
                    </div>
                    <div className={styles.row}>
                      <span>Liczba kartonów:</span>
                      <span className={styles.value}>{calculationResult.logistics.boxesNeeded}</span>
                    </div>
                    <div className={styles.row}>
                      <span>Waga kartonu:</span>
                      <span className={styles.value}>{calculationResult.logistics.weightPerBox.toFixed(2)} kg</span>
                    </div>
                    <div className={styles.row}>
                      <span>Sztuk na palecie:</span>
                      <span className={styles.value}>{calculationResult.logistics.palletCapacity} szt</span>
                    </div>
                    <div className={styles.row}>
                      <span>Liczba palet:</span>
                      <span className={styles.value}>{calculationResult.logistics.palletsNeeded}</span>
                    </div>
                  </div>
                  
                  {/* Szczegóły powierzchni */}
                  <div className={styles.componentsSection}>
                    <h3>Komponenty:</h3>
                    <div className={styles.componentsList}>
                      {calculationResult.components.map((comp: any, idx: number) => (
                        <div key={idx} className={styles.componentRow}>
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
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Dane klienta</h2>
              <button 
                onClick={() => setShowCustomerForm(false)}
                className={styles.closeBtn}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="NIP"
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Nazwa firmy"
                className={styles.input}
              />
              <div className={styles.inputGrid}>
                <input
                  type="text"
                  placeholder="Adres"
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Miasto"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className={styles.cancelBtn}
                >
                  Anuluj
                </button>
                <button
                  onClick={() => {
                    setCustomerData({company: 'Test Sp. z o.o.'});
                    setShowCustomerForm(false);
                  }}
                  className={styles.saveBtn}
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
};