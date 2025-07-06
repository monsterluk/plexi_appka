// components/ProductOptions/ImpulsOptions.tsx

import React from 'react';
import { ImpulsOptions as ImpulsOptionsType } from '../../types';

interface Props {
  options: ImpulsOptionsType;
  onChange: (options: Partial<ImpulsOptionsType>) => void;
}

export function ImpulsOptions({ options, onChange }: Props) {
  return (
    <div className="impuls-options">
      <h3>Opcje impulsu kasowego</h3>
      
      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <p>Ekspozytor przykasowy z plecami, bokami i półkami z ogranicznikami 60mm</p>
      </div>
      
      {/* Rodzaj plexi */}
      <div className="option-group">
        <label>Rodzaj plexi na plecy:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="plexiType"
              value="clear"
              checked={options.plexiType === 'clear'}
              onChange={() => onChange({ plexiType: 'clear' })}
            />
            <span>Bezbarwna</span>
          </label>
          <label>
            <input
              type="radio"
              name="plexiType"
              value="white"
              checked={options.plexiType === 'white'}
              onChange={() => onChange({ plexiType: 'white' })}
            />
            <span>Biała (+10%)</span>
          </label>
        </div>
      </div>
      
      {/* Grubość */}
      <div className="option-group">
        <label>Grubość materiału:</label>
        <select
          value={options.thickness}
          onChange={(e) => onChange({ thickness: parseInt(e.target.value) })}
        >
          <option value="2">2 mm</option>
          <option value="3">3 mm</option>
          <option value="4">4 mm</option>
          <option value="5">5 mm</option>
          <option value="6">6 mm</option>
          <option value="8">8 mm</option>
          <option value="10">10 mm</option>
        </select>
      </div>
      
      {/* Liczba półek */}
      <div className="option-group">
        <label>Liczba półek (min. 2):</label>
        <input
          type="number"
          min="2"
          max="10"
          value={options.shelvesCount}
          onChange={(e) => onChange({ 
            shelvesCount: Math.max(2, parseInt(e.target.value) || 2) 
          })}
        />
      </div>
      
      {/* Grafika */}
      <div className="option-group">
        <label>Grafika na plecach:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="graphics"
              value="none"
              checked={options.graphics.type === 'none'}
              onChange={() => onChange({ graphics: { type: 'none' } })}
            />
            <span>Brak</span>
          </label>
          <label>
            <input
              type="radio"
              name="graphics"
              value="single"
              checked={options.graphics.type === 'single'}
              onChange={() => onChange({ graphics: { type: 'single' } })}
            />
            <span>Jednostronna (75 zł/m²)</span>
          </label>
          <label>
            <input
              type="radio"
              name="graphics"
              value="double"
              checked={options.graphics.type === 'double'}
              onChange={() => onChange({ graphics: { type: 'double' } })}
            />
            <span>Dwustronna (150 zł/m²)</span>
          </label>
        </div>
      </div>
      
      {/* Wizualizacja */}
      <div className="impuls-preview">
        <svg viewBox="0 0 300 400" width="300" height="400">
          {/* Widok z boku impulsu kasowego */}
          <g transform="translate(50, 50)">
            {/* Plecy */}
            <rect x="0" y="0" width="20" height="300" 
                  fill="#90caf9" stroke="#1976d2" strokeWidth="2"/>
            <text x="10" y="-10" textAnchor="middle" fontSize="12">Plecy</text>
            
            {/* Półki z ogranicznikami */}
            {Array.from({ length: options.shelvesCount }, (_, i) => {
              const y = 50 + (250 / (options.shelvesCount + 1)) * (i + 1);
              return (
                <g key={i}>
                  {/* Półka */}
                  <rect x="20" y={y-5} width="150" height="10" 
                        fill="#ffb74d" stroke="#f57c00" strokeWidth="1"/>
                  {/* Ogranicznik 60mm */}
                  <rect x="170" y={y-5-30} width="10" height="30" 
                        fill="#ff9800" stroke="#e65100" strokeWidth="1"/>
                  <text x="95" y={y+20} textAnchor="middle" fontSize="10">
                    Półka {i + 1}
                  </text>
                </g>
              );
            })}
            
            {/* Bok */}
            <rect x="170" y="0" width="20" height="300" 
                  fill="#90caf9" stroke="#1976d2" strokeWidth="2"/>
            <text x="180" y="-10" textAnchor="middle" fontSize="12">Bok</text>
          </g>
        </svg>
      </div>
      
      <style>{`
        .impuls-options {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .info-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: #e3f2fd;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .info-box i {
          color: #1976d2;
          font-size: 20px;
        }
        .option-group {
          margin: 20px 0;
        }
        .option-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }
        .radio-group {
          display: flex;
          gap: 20px;
        }
        .radio-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
        }
        .impuls-preview {
          margin-top: 30px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}