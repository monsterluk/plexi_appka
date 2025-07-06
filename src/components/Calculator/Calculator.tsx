// Calculator component - główny komponent kalkulatora plexi
// components/Calculator/Calculator.tsx

import React from 'react';
import { useCalculatorLogic } from '../../hooks/useCalculatorLogic';
import { ProductSelector } from './ProductSelector';
import { DimensionsInput } from './DimensionsInput';
import { ContainerOptions } from '../ProductOptions/ContainerOptions';
import { CabinetOptions } from '../ProductOptions/CabinetOptions';
import { EnclosureOptions } from '../ProductOptions/EnclosureOptions';
import { WallSelector } from '../ProductOptions/WallSelector';
import { Results } from './Results';
import { materials } from '../../Data/materials';
import { GablotaOptions } from '../ProductOptions/GablotaOptions';
import { useProductSpecific } from '../../hooks/useProductSpecific';

export function Calculator() {
  const {
    state,
    results,
    updateState,
    updateDimensions,
    updateContainerOptions,
    updateEnclosureWalls
  } = useCalculatorLogic();
  
  const productSpecific = useProductSpecific(state.productType);

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1>Kalkulator PlexiSystem</h1>
        <p>Profesjonalny kalkulator cen produktów z plexi i poliwęglanu</p>
      </div>
      
      <div className="calculator-body">
        <div className="form-section">
          {/* Wybór produktu */}
          <ProductSelector
            value={state.productType}
            onChange={(productType) => updateState({ productType })}
          />
          
          {/* Wybór materiału */}
          <div className="form-group">
            <label>Materiał</label>
            <select
              value={state.material?.id || ''}
              onChange={(e) => {
                const material = materials.find(m => m.id === parseInt(e.target.value));
                updateState({ material });
              }}
            >
              <option value="">Wybierz materiał</option>
              {/* Lista materiałów */}
            </select>
          </div>
          
          {/* Grubość */}
          <div className="form-group">
            <label>Grubość (mm)</label>
            <select
              value={state.thickness}
              onChange={(e) => updateState({ thickness: parseFloat(e.target.value) })}
            >
              {state.material?.availableThicknesses.map(t => (
                <option key={t} value={t}>{t} mm</option>
              ))}
            </select>
          </div>
          
          {/* Wymiary */}
          <DimensionsInput
            dimensions={state.dimensions}
            onChange={updateDimensions}
            showDepth={['pojemnik', 'gablota', 'obudowa'].includes(state.productType)}
          />
          
          {/* Ilość */}
          <div className="form-group">
            <label>Ilość (szt)</label>
            <input
              type="number"
              min="1"
              value={state.quantity}
              onChange={(e) => updateState({ quantity: parseInt(e.target.value) || 1 })}
            />
          </div>
          
          {/* Opcje specyficzne dla produktu */}
          <div className="product-options">
            {state.productType === 'pojemnik' && state.containerOptions && (
              <ContainerOptions
                options={state.containerOptions}
                onChange={updateContainerOptions}
              />
            )}
            
            {state.productType === 'obudowa' && state.enclosureOptions && (
              <>
                <WallSelector
                  walls={state.enclosureOptions.walls}
                  onChange={updateEnclosureWalls}
                />
                <EnclosureOptions
                  features={state.enclosureOptions.features}
                  onChange={(features) => updateState({
                    enclosureOptions: {
                      ...state.enclosureOptions!,
                      features
                    }
                  })}
                />
              </>
            )}
         
            {state.productType === 'gablota' && productSpecific.gablotaOptions && (
  <GablotaOptions
    options={productSpecific.gablotaOptions}
    onChange={(options) => {
      productSpecific.updateGablotaOptions(options);
      updateState({ gablotaOptions: options });
    }}
    dimensions={state.dimensions}
  />
)}

            
            
            {/* Inne opcje produktów */}
          </div>
          
          {/* Dodatki */}
          <div className="addons-section">
            <h3>Usługi dodatkowe</h3>
            
            {/* Wiercenie */}
            <div className="addon-option">
              <label>
                <input
                  type="checkbox"
                  checked={state.addons.drilling?.enabled || false}
                  onChange={(e) => updateState({
                    addons: {
                      ...state.addons,
                      drilling: {
                        enabled: e.target.checked,
                        holesCount: state.addons.drilling?.holesCount || 0
                      }
                    }
                  })}
                />
                Wiercenie otworów
              </label>
              {state.addons.drilling?.enabled && (
                <input
                  type="number"
                  min="0"
                  placeholder="Ilość otworów"
                  value={state.addons.drilling.holesCount}
                  onChange={(e) => updateState({
                    addons: {
                      ...state.addons,
                      drilling: {
                        ...state.addons.drilling!,
                        holesCount: parseInt(e.target.value) || 0
                      }
                    }
                  })}
                />
              )}
            </div>
            
            {/* Polerowanie */}
            <div className="addon-option">
              <label>
                <input
                  type="checkbox"
                  checked={state.addons.edgePolishing?.enabled || false}
                  onChange={(e) => updateState({
                    addons: {
                      ...state.addons,
                      edgePolishing: {
                        enabled: e.target.checked,
                        customLength: undefined
                      }
                    }
                  })}
                />
                Polerowanie krawędzi
              </label>
            </div>
            
            {/* Więcej dodatków... */}
          </div>
        </div>
        
        {/* Wyniki */}
        <div className="results-section">
          <Results results={results} />
        </div>
      </div>
    </div>
  );
}