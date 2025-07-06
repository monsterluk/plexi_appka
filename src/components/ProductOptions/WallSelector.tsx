// components/ProductOptions/WallSelector.tsx

import React from 'react';
import { EnclosureOptions } from '../../types';

interface Props {
  walls: EnclosureOptions['walls'];
  onChange: (walls: Partial<EnclosureOptions['walls']>) => void;
}

export function WallSelector({ walls, onChange }: Props) {
  const selectedCount = Object.values(walls).filter(Boolean).length;
  
  return (
    <div className="wall-selector">
      <h4>Wybierz ściany obudowy ({selectedCount}/6)</h4>
      
      {/* Wizualizacja 3D */}
      <div className="wall-visualizer-3d">
        <svg viewBox="0 0 400 400" width="400" height="400">
          {/* Podstawa sześcianu w perspektywie izometrycznej */}
          <g transform="translate(200, 200)">
            {/* Tył */}
            <g className={`wall-shape ${walls.back ? 'selected' : ''}`}
               onClick={() => onChange({ back: !walls.back })}>
              <path d="M -80,-80 L 0,-120 L 0,-40 L -80,0 Z"
                    fill={walls.back ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.back ? 0.8 : 0.3}/>
              <text x="-40" y="-60" textAnchor="middle" fontSize="14" fill="white">
                Tył
              </text>
            </g>
            
            {/* Prawy bok */}
            <g className={`wall-shape ${walls.right ? 'selected' : ''}`}
               onClick={() => onChange({ right: !walls.right })}>
              <path d="M 0,-120 L 80,-80 L 80,0 L 0,-40 Z"
                    fill={walls.right ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.right ? 0.8 : 0.3}/>
              <text x="40" y="-60" textAnchor="middle" fontSize="14" fill="white">
                Prawy
              </text>
            </g>
            
            {/* Góra */}
            <g className={`wall-shape ${walls.top ? 'selected' : ''}`}
               onClick={() => onChange({ top: !walls.top })}>
              <path d="M -80,-80 L 0,-120 L 80,-80 L 0,-40 Z"
                    fill={walls.top ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.top ? 0.8 : 0.3}/>
              <text x="0" y="-80" textAnchor="middle" fontSize="14" fill="white">
                Góra
              </text>
            </g>
            
            {/* Przód */}
            <g className={`wall-shape ${walls.front ? 'selected' : ''}`}
               onClick={() => onChange({ front: !walls.front })}>
              <path d="M -80,0 L 0,-40 L 0,40 L -80,80 Z"
                    fill={walls.front ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.front ? 0.8 : 0.3}/>
              <text x="-40" y="20" textAnchor="middle" fontSize="14" fill="white">
                Przód
              </text>
            </g>
            
            {/* Lewy bok */}
            <g className={`wall-shape ${walls.left ? 'selected' : ''}`}
               onClick={() => onChange({ left: !walls.left })}>
              <path d="M 0,-40 L 80,0 L 80,80 L 0,40 Z"
                    fill={walls.left ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.left ? 0.8 : 0.3}/>
              <text x="40" y="20" textAnchor="middle" fontSize="14" fill="white">
                Lewy
              </text>
            </g>
            
            {/* Dół */}
            <g className={`wall-shape ${walls.bottom ? 'selected' : ''}`}
               onClick={() => onChange({ bottom: !walls.bottom })}>
              <path d="M -80,0 L 0,40 L 80,0 L 0,-40 Z"
                    fill={walls.bottom ? '#667eea' : '#e0e0e0'}
                    stroke="#333"
                    strokeWidth="2"
                    opacity={walls.bottom ? 0.8 : 0.3}/>
              <text x="0" y="0" textAnchor="middle" fontSize="14" fill="white">
                Dół
              </text>
            </g>
          </g>
        </svg>
      </div>
      
      {/* Szybkie predefiniowane opcje */}
      <div className="quick-options">
        <button onClick={() => onChange({
          front: false, back: true, left: true, right: true, top: false, bottom: true
        })}>
          Obudowa U (3 ściany + dno)
        </button>
        <button onClick={() => onChange({
          front: false, back: true, left: true, right: true, top: true, bottom: true
        })}>
          Obudowa bez frontu (5 ścian)
        </button>
        <button onClick={() => onChange({
          front: true, back: true, left: true, right: true, top: true, bottom: true
        })}>
          Pełna obudowa (6 ścian)
        </button>
      </div>
      
      <style>{`
        .wall-shape {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .wall-shape:hover path {
          opacity: 1 !important;
          filter: brightness(1.1);
        }
        .quick-options {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .quick-options button {
          padding: 8px 16px;
          border: 1px solid #667eea;
          background: white;
          color: #667eea;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-options button:hover {
          background: #667eea;
          color: white;
        }
      `}</style>
    </div>
  );
}