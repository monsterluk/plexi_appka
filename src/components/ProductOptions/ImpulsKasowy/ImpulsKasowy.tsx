import React, { useState } from 'react';
import { ImpulsKasowyOptions } from '../../../types/impuls.types';
import { calculateImpulsKasowy } from '../../../calculators/calculateImpulsKasowy';
import { ImpulsVisualizer } from './ImpulsVisualizer';
import { CustomerForm, CustomerData } from '../../CustomerForm/CustomerForm';
import { PDFGenerator } from '../../../utils/pdfGenerator';
import styles from './ImpulsKasowy.module.css';
import { FileDown, Save, Calculator } from 'lucide-react';

export const ImpulsKasowy: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 800,
    depth: 300
  });

  const [quantity, setQuantity] = useState(1);
  
  const [options, setOptions] = useState<ImpulsKasowyOptions>({
    plexiType: 'clear',
    thickness: 3,
    shelvesCount: 3,
    limiterHeight: 60,
    graphics: {
      enabled: false,
      type: 'single',
      coverage: 'back-only'
    },
    features: {
      reinforcedShelves: false,
      roundedCorners: false,
      antiSlipStrips: false,
      customLimiterHeight: false
    }
  });

  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Walidacja wymiarów
  const validateDimensions = () => {
    return dimensions.width >= 200 && dimensions.width <= 2000 &&
           dimensions.height >= 300 && dimensions.height <= 2500 &&
           dimensions.depth >= 150 && dimensions.depth <= 600;
  };

  // Obliczanie odstępów między półkami
  const shelfSpacing = dimensions.height / (options.shelvesCount + 1);

  // Kalkulacja ceny
  const handleCalculate = () => {
    if (!validateDimensions()) {
      alert('Nieprawidłowe wymiary! Sprawdź ograniczenia.');
      return;
    }

    const result = calculateImpulsKasowy(dimensions, options, quantity);
    setCalculationResult(result);
  };

  // Generowanie PDF
  const handleGeneratePDF = () => {
    if (!calculationResult || !customerData) {
      alert('Najpierw wypełnij dane klienta i wykonaj kalkulację!');
      return;
    }

    const quoteData = {
      customer: customerData,
      product: {
        name: 'Impuls Kasowy',
        dimensions,
        quantity,
        options
      },
      pricing: {
        materialCost: calculationResult.materialCost,
        additionalCosts: [
          { name: 'Gięcie na gorąco', cost: calculationResult.bendingCost },
          ...(calculationResult.graphicsCost > 0 ? [{ name: 'Grafika', cost: calculationResult.graphicsCost }] : [])
        ],
        totalCost: calculationResult.totalCost
      },
      quoteNumber: `OF-${Date.now()}`,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dni
    };

    PDFGenerator.generateQuote(quoteData);
  };

  // Zapisywanie oferty
  const handleSaveQuote = () => {
    if (!calculationResult || !customerData) {
      alert('Najpierw wypełnij dane klienta i wykonaj kalkulację!');
      return;
    }

    const quoteData = {
      customer: customerData,
      product: {
        name: 'Impuls Kasowy',
        dimensions,
        quantity,
        options
      },
      pricing: {
        materialCost: calculationResult.materialCost,
        additionalCosts: [
          { name: 'Gięcie na gorąco', cost: calculationResult.bendingCost },
          ...(calculationResult.graphicsCost > 0 ? [{ name: 'Grafika', cost: calculationResult.graphicsCost }] : [])
        ],
        totalCost: calculationResult.totalCost
      },
      quoteNumber: `OF-${Date.now()}`,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    PDFGenerator.saveQuote(quoteData);
    alert('Oferta została zapisana!');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Kalkulator - Impuls Kasowy</h2>

      <div className={styles.mainGrid}>
        {/* Lewa kolumna - formularz */}
        <div className={styles.formColumn}>
          {/* Wymiary */}
          <section className={styles.section}>
            <h3>Wymiary (mm)</h3>
            <div className={styles.dimensionsGrid}>
              <div className={styles.field}>
                <label>Szerokość</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({...dimensions, width: Number(e.target.value)})}
                  min="200"
                  max="2000"
                />
                <span className={styles.hint}>200-2000 mm</span>
              </div>
              <div className={styles.field}>
                <label>Wysokość</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
                  min="300"
                  max="2500"
                />
                <span className={styles.hint}>300-2500 mm</span>
              </div>
              <div className={styles.field}>
                <label>Głębokość</label>
                <input
                  type="number"
                  value={dimensions.depth}
                  onChange={(e) => setDimensions({...dimensions, depth: Number(e.target.value)})}
                  min="150"
                  max="600"
                />
                <span className={styles.hint}>150-600 mm</span>
              </div>
            </div>
          </section>

          {/* Opcje podstawowe */}
          <section className={styles.section}>
            <h3>Opcje podstawowe</h3>
            
            <div className={styles.field}>
              <label>Rodzaj plexi</label>
              <select
                value={options.plexiType}
                onChange={(e) => setOptions({...options, plexiType: e.target.value as 'clear' | 'white'})}
              >
                <option value="clear">Bezbarwna</option>
                <option value="white">Biała</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Grubość (mm)</label>
              <select
                value={options.thickness}
                onChange={(e) => setOptions({...options, thickness: Number(e.target.value)})}
              >
                <option value="3">3 mm</option>
                <option value="4">4 mm</option>
                <option value="5">5 mm</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Liczba półek</label>
              <input
                type="number"
                value={options.shelvesCount}
                onChange={(e) => setOptions({...options, shelvesCount: Number(e.target.value)})}
                min="1"
                max="10"
              />
            </div>

            <div className={styles.field}>
              <label>Ilość sztuk</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
          </section>

          {/* Grafika */}
          <section className={styles.section}>
            <h3>Grafika</h3>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="graphics"
                checked={options.graphics.enabled}
                onChange={(e) => setOptions({
                  ...options,
                  graphics: { ...options.graphics, enabled: e.target.checked }
                })}
              />
              <label htmlFor="graphics">Dodaj grafikę</label>
            </div>

            {options.graphics.enabled && (
              <>
                <div className={styles.field}>
                  <label>Typ grafiki</label>
                  <select
                    value={options.graphics.type}
                    onChange={(e) => setOptions({
                      ...options,
                      graphics: { ...options.graphics, type: e.target.value as 'single' | 'double' }
                    })}
                  >
                    <option value="single">Jednostronna</option>
                    <option value="double">Dwustronna</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Pokrycie</label>
                  <select
                    value={options.graphics.coverage}
                    onChange={(e) => setOptions({
                      ...options,
                      graphics: { ...options.graphics, coverage: e.target.value as 'back-only' | 'back-and-sides' }
                    })}
                  >
                    <option value="back-only">Tylko plecy</option>
                    <option value="back-and-sides">Plecy i boki</option>
                  </select>
                </div>
              </>
            )}
          </section>

          {/* Dodatkowe funkcje */}
          <section className={styles.section}>
            <h3>Dodatkowe funkcje</h3>
            
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="reinforced"
                checked={options.features.reinforcedShelves}
                onChange={(e) => setOptions({
                  ...options,
                  features: { ...options.features, reinforcedShelves: e.target.checked }
                })}
              />
              <label htmlFor="reinforced">Wzmocnione półki</label>
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="rounded"
                checked={options.features.roundedCorners}
                onChange={(e) => setOptions({
                  ...options,
                  features: { ...options.features, roundedCorners: e.target.checked }
                })}
              />
              <label htmlFor="rounded">Zaokrąglone rogi</label>
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="antislip"
                checked={options.features.antiSlipStrips}
                onChange={(e) => setOptions({
                  ...options,
                  features: { ...options.features, antiSlipStrips: e.target.checked }
                })}
              />
              <label htmlFor="antislip">Paski antypoślizgowe</label>
            </div>
          </section>

          {/* Przyciski akcji */}
          <div className={styles.actions}>
            <button 
              className={styles.calculateButton}
              onClick={handleCalculate}
            >
              <Calculator size={20} />
              Oblicz cenę
            </button>
          </div>
        </div>

        {/* Prawa kolumna - wizualizacja i wyniki */}
        <div className={styles.resultColumn}>
          <ImpulsVisualizer
            dimensions={dimensions}
            options={options}
            shelfSpacing={shelfSpacing}
          />

          {calculationResult && (
            <div className={styles.results}>
              <h3>Wynik kalkulacji</h3>
              
              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Koszt materiału:</span>
                  <span>{calculationResult.materialCost.toFixed(2)} zł</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Gięcie na gorąco:</span>
                  <span>{calculationResult.bendingCost.toFixed(2)} zł</span>
                </div>
                {calculationResult.graphicsCost > 0 && (
                  <div className={styles.priceRow}>
                    <span>Grafika:</span>
                    <span>{calculationResult.graphicsCost.toFixed(2)} zł</span>
                  </div>
                )}
                <div className={styles.priceRow + ' ' + styles.total}>
                  <span>RAZEM NETTO:</span>
                  <span>{calculationResult.totalCost.toFixed(2)} zł</span>
                </div>
                <div className={styles.priceRow + ' ' + styles.total}>
                  <span>RAZEM BRUTTO (23% VAT):</span>
                  <span>{(calculationResult.totalCost * 1.23).toFixed(2)} zł</span>
                </div>
              </div>

              <div className={styles.resultActions}>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => setShowCustomerForm(!showCustomerForm)}
                >
                  {showCustomerForm ? 'Ukryj formularz' : 'Dane klienta'}
                </button>
                
                {customerData && (
                  <>
                    <button 
                      className={styles.primaryButton}
                      onClick={handleGeneratePDF}
                    >
                      <FileDown size={20} />
                      Generuj PDF
                    </button>
                    <button 
                      className={styles.secondaryButton}
                      onClick={handleSaveQuote}
                    >
                      <Save size={20} />
                      Zapisz ofertę
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formularz klienta */}
      {showCustomerForm && (
        <div className={styles.customerFormWrapper}>
          <CustomerForm
            onSubmit={(data) => {
              setCustomerData(data);
              setShowCustomerForm(false);
            }}
            initialData={customerData || undefined}
          />
        </div>
      )}
    </div>
  );
};