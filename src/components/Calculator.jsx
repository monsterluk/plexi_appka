// components/Calculator.jsx

import React from 'react';
import { useCalculatorLogic } from '../hooks/useCalculatorLogic';

export function Calculator() {
  const {
    formData,
    materials,
    addons,
    updateFormData,
    resetCalculator,
    results
  } = useCalculatorLogic();

  const handleMaterialChange = (materialId) => {
    const material = materials.find(m => m.id === parseInt(materialId));
    updateFormData({ material });
  };

  const handleDimensionChange = (dimension, value) => {
    updateFormData({ [dimension]: parseFloat(value) || 0 });
  };

  const handleAddonToggle = (addonId, enabled, quantity = 0) => {
    updateFormData({
      addons: {
        ...formData.addons,
        [addonId]: { enabled, quantity }
      }
    });
  };

  return (
    <div className="calculator">
      <h1>Kalkulator PlexiSystem</h1>
      
      {/* Formularz */}
      <form>
        {/* Typ produktu */}
        <select 
          value={formData.productType}
          onChange={(e) => updateFormData({ productType: e.target.value })}
        >
          <option value="">Wybierz typ produktu</option>
          <option value="plyta">Płyta standardowa</option>
          <option value="pojemnik">Pojemnik/Organizer</option>
          <option value="gablota">Gablota</option>
          {/* ... inne opcje */}
        </select>

        {/* Materiał */}
        <select 
          value={formData.material?.id || ''}
          onChange={(e) => handleMaterialChange(e.target.value)}
        >
          <option value="">Wybierz materiał</option>
          {materials.map(mat => (
            <option key={mat.id} value={mat.id}>
              {mat.nazwa} ({mat.cena_za_m2} zł/m²)
            </option>
          ))}
        </select>

        {/* Wymiary */}
        <input
          type="number"
          placeholder="Szerokość (mm)"
          value={formData.width}
          onChange={(e) => handleDimensionChange('width', e.target.value)}
        />
        
        <input
          type="number"
          placeholder="Wysokość (mm)"
          value={formData.height}
          onChange={(e) => handleDimensionChange('height', e.target.value)}
        />

        {/* Przegrody dla pojemników */}
        {formData.productType === 'pojemnik' && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={formData.partitions.enabled}
                onChange={(e) => updateFormData({
                  partitions: {
                    ...formData.partitions,
                    enabled: e.target.checked
                  }
                })}
              />
              Dodaj przegrody
            </label>
            
            {formData.partitions.enabled && (
              <>
                <input
                  type="number"
                  placeholder="Liczba przegród"
                  value={formData.partitions.count}
                  onChange={(e) => updateFormData({
                    partitions: {
                      ...formData.partitions,
                      count: parseInt(e.target.value) || 0
                    }
                  })}
                />
                <select
                  value={formData.partitions.direction}
                  onChange={(e) => updateFormData({
                    partitions: {
                      ...formData.partitions,
                      direction: e.target.value
                    }
                  })}
                >
                  <option value="width">Wzdłuż szerokości</option>
                  <option value="height">Wzdłuż wysokości</option>
                </select>
              </>
            )}
          </div>
        )}
      </form>

      {/* Wyniki */}
      <div className="results">
        <h2>Podsumowanie</h2>
        <p>Powierzchnia: {results.material.surface.toFixed(4)} m²</p>
        <p>Waga: {results.material.weight.toFixed(2)} kg</p>
        {results.material.waste > 0 && (
          <p>Odpad produkcyjny: {results.material.waste} mm</p>
        )}
        
        <h3>Koszty:</h3>
        <p>Materiał: {results.material.cost.toFixed(2)} zł</p>
        {results.partitions.cost > 0 && (
          <p>Przegrody: {results.partitions.cost.toFixed(2)} zł</p>
        )}
        {results.addons.cost > 0 && (
          <p>Dodatki: {results.addons.cost.toFixed(2)} zł</p>
        )}
        
        <hr />
        <p><strong>Koszt produktu: {results.productCost.toFixed(2)} zł</strong></p>
        <p>Koszt logistyki: {results.logisticsCost.toFixed(2)} zł</p>
        
        <hr />
        <p><strong>Suma netto: {results.totalNetto.toFixed(2)} zł</strong></p>
        <p>VAT 23%: {results.vat.toFixed(2)} zł</p>
        <p><strong>Suma brutto: {results.totalBrutto.toFixed(2)} zł</strong></p>
      </div>

      <button onClick={resetCalculator}>Wyczyść</button>
    </div>
  );
}