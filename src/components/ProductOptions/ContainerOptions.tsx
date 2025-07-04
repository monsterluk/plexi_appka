// ContainerOptions component for container-specific configuration
// components/ProductOptions/ContainerOptions.tsx

import React from 'react';
import { ContainerOptions as ContainerOptionsType } from '../../types';

interface Props {
  options: ContainerOptionsType;
  onChange: (options: Partial<ContainerOptionsType>) => void;
}

export function ContainerOptions({ options, onChange }: Props) {
  return (
    <div className="container-options">
      <h3>Opcje pojemnika</h3>
      
      {/* Wieko */}
      <div className="option-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={options.hasLid}
            onChange={(e) => onChange({ hasLid: e.target.checked })}
          />
          <span>Dodaj wieko</span>
          <i className="icon-lid" />
        </label>
      </div>
      
      {/* Przegrody */}
      <div className="partitions-section">
        <h4>Przegrody</h4>
        
        {/* Przegrody poprzeczne */}
        <div className="partition-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.partitions.width.enabled}
              onChange={(e) => onChange({
                partitions: {
                  ...options.partitions,
                  width: { ...options.partitions.width, enabled: e.target.checked }
                }
              })}
            />
            <span>Przegrody poprzeczne</span>
            <i className="icon-partition-width" />
          </label>
          
          {options.partitions.width.enabled && (
            <div className="partition-count">
              <label>Ilość:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.partitions.width.count}
                onChange={(e) => onChange({
                  partitions: {
                    ...options.partitions,
                    width: { 
                      ...options.partitions.width, 
                      count: parseInt(e.target.value) || 0 
                    }
                  }
                })}
              />
            </div>
          )}
        </div>
        
        {/* Przegrody podłużne */}
        <div className="partition-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.partitions.length.enabled}
              onChange={(e) => onChange({
                partitions: {
                  ...options.partitions,
                  length: { ...options.partitions.length, enabled: e.target.checked }
                }
              })}
            />
            <span>Przegrody podłużne</span>
            <i className="icon-partition-length" />
          </label>
          
          {options.partitions.length.enabled && (
            <div className="partition-count">
              <label>Ilość:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={options.partitions.length.count}
                onChange={(e) => onChange({
                  partitions: {
                    ...options.partitions,
                    length: { 
                      ...options.partitions.length, 
                      count: parseInt(e.target.value) || 0 
                    }
                  }
                })}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Okucia */}
      <div className="hardware-section">
        <h4>Okucia</h4>
        
        <div className="hardware-option">
          <label>Zawiasy:</label>
          <input
            type="number"
            min="0"
            max="10"
            value={options.hardware.hinges}
            onChange={(e) => onChange({
              hardware: {
                ...options.hardware,
                hinges: parseInt(e.target.value) || 0
              }
            })}
          />
        </div>
        
        <div className="hardware-option">
          <label>Zamki:</label>
          <input
            type="number"
            min="0"
            max="5"
            value={options.hardware.locks}
            onChange={(e) => onChange({
              hardware: {
                ...options.hardware,
                locks: parseInt(e.target.value) || 0
              }
            })}
          />
        </div>
      </div>
    </div>
  );
}