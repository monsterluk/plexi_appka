// Container3D.tsx - Komponent do wizualizacji 3D kontenerów z pleksi
// components/Visualizations/Container3D.tsx

import React from 'react';
import { ContainerOptions, Dimensions } from '../../types';

interface Props {
  dimensions: Dimensions;
  options: ContainerOptions;
  productType: 'pojemnik' | 'gablota';
}

export function Container3D({ dimensions, options, productType }: Props) {
  const scale = 0.3;
  const { width, height, depth } = dimensions;
  
  // Skalowane wymiary
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  
  // Pozycje przegród
  const widthPartitions = options.partitions.width.count;
  const lengthPartitions = options.partitions.length.count;
  
  return (
    <div className="container-3d">
      <h4>Wizualizacja {productType === 'gablota' ? 'gabloty' : 'pojemnika'}</h4>
      
      <svg viewBox="0 0 600 400" width="600" height="400">
        <g transform="translate(300, 200)">
          {/* Tył */}
          {productType === 'pojemnik' && (
            <g className="wall back">
              <path d={`M ${-w/2},${-h/2} L ${-w/2+d*0.5},${-h/2-d*0.3} 
                       L ${-w/2+d*0.5},${h/2-d*0.3} L ${-w/2},${h/2} Z`}
                    fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
            </g>
          )}
          
          {/* Dno (tylko dla pojemnika) */}
          {productType === 'pojemnik' && (
            <g className="wall bottom">
              <path d={`M ${-w/2},${h/2} L ${-w/2+d*0.5},${h/2-d*0.3} 
                       L ${w/2+d*0.5},${h/2-d*0.3} L ${w/2},${h/2} Z`}
                    fill="#bbdefb" stroke="#1976d2" strokeWidth="2"/>
            </g>
          )}
          
          {/* Lewy bok */}
          <g className="wall left">
            <path d={`M ${-w/2},${-h/2} L ${-w/2},${h/2} 
                     L ${-w/2+d*0.5},${h/2-d*0.3} L ${-w/2+d*0.5},${-h/2-d*0.3} Z`}
                  fill="#90caf9" stroke="#1976d2" strokeWidth="2"/>
          </g>
          
          {/* Prawy bok */}
          <g className="wall right">
            <path d={`M ${w/2+d*0.5},${-h/2-d*0.3} L ${w/2+d*0.5},${h/2-d*0.3} 
                     L ${w/2},${h/2} L ${w/2},${-h/2} Z`}
                  fill="#90caf9" stroke="#1976d2" strokeWidth="2"/>
          </g>
          
          {/* Przód (tylko dla pojemnika) */}
          {productType === 'pojemnik' && (
            <g className="wall front" opacity="0.3">
              <path d={`M ${w/2},${-h/2} L ${w/2},${h/2} 
                       L ${-w/2},${h/2} L ${-w/2},${-h/2} Z`}
                    fill="none" stroke="#1976d2" strokeWidth="2" strokeDasharray="5,5"/>
            </g>
          )}
          
          {/* Wieko (jeśli włączone) */}
          {options.hasLid && (
            <g className="wall lid" opacity="0.7">
              <path d={`M ${-w/2},${-h/2} L ${-w/2+d*0.5},${-h/2-d*0.3} 
                       L ${w/2+d*0.5},${-h/2-d*0.3} L ${w/2},${-h/2} Z`}
                    fill="#64b5f6" stroke="#1976d2" strokeWidth="2"/>
              <text x="0" y={-h/2-d*0.15} textAnchor="middle" fontSize="12" fill="#1976d2">
                Wieko
              </text>
            </g>
          )}
          
          {/* Przegrody poprzeczne */}
          {options.partitions.width.enabled && widthPartitions > 0 && (
            <>
              {Array.from({ length: widthPartitions }, (_, i) => {
                const pos = -w/2 + (w / (widthPartitions + 1)) * (i + 1);
                return (
                  <g key={`width-${i}`} className="partition">
                    <path d={`M ${pos},${-h/2} L ${pos},${h/2} 
                             L ${pos+d*0.5},${h/2-d*0.3} L ${pos+d*0.5},${-h/2-d*0.3} Z`}
                          fill="#ffccbc" stroke="#ff5722" strokeWidth="1.5" opacity="0.8"/>
                  </g>
                );
              })}
            </>
          )}
          
          {/* Przegrody podłużne */}
          {options.partitions.length.enabled && lengthPartitions > 0 && (
            <>
              {Array.from({ length: lengthPartitions }, (_, i) => {
                const yPos = -h/2 + (h / (lengthPartitions + 1)) * (i + 1);
                const yPos3d = yPos - (d*0.3 * i / lengthPartitions);
                return (
                  <g key={`length-${i}`} className="partition">
                    <path d={`M ${-w/2},${yPos} L ${w/2},${yPos} 
                             L ${w/2+d*0.5},${yPos3d} L ${-w/2+d*0.5},${yPos3d} Z`}
                          fill="#ffccbc" stroke="#ff5722" strokeWidth="1.5" opacity="0.8"/>
                  </g>
                );
              })}
            </>
          )}
          
          {/* Etykiety wymiarów */}
          <g className="dimensions-labels">
            <text x="0" y={h/2 + 30} textAnchor="middle" fontSize="14" fill="#666">
              {width} mm
            </text>
            <text x={w/2 + 40} y="0" textAnchor="middle" fontSize="14" fill="#666"
                  transform={`rotate(90 ${w/2 + 40} 0)`}>
              {height} mm
            </text>
            <text x={w/2 + d*0.25} y={-h/2 - d*0.15 - 20} textAnchor="middle" 
                  fontSize="14" fill="#666" transform="rotate(-30)">
              {depth} mm
            </text>
          </g>
        </g>
      </svg>
      
      {/* Legenda */}
      <div className="legend">
        <div className="legend-item">
          <span className="color-box" style={{background: '#90caf9'}}></span>
          <span>Ściany</span>
        </div>
        {productType === 'pojemnik' && (
          <div className="legend-item">
            <span className="color-box" style={{background: '#bbdefb'}}></span>
            <span>Dno</span>
          </div>
        )}
        {options.hasLid && (
          <div className="legend-item">
            <span className="color-box" style={{background: '#64b5f6'}}></span>
            <span>Wieko</span>
          </div>
        )}
        {(options.partitions.width.count > 0 || options.partitions.length.count > 0) && (
          <div className="legend-item">
            <span className="color-box" style={{background: '#ffccbc'}}></span>
            <span>Przegrody</span>
          </div>
        )}
      </div>
      
      <style>{`
        .container-3d {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        .legend {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          justify-content: center;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .color-box {
          width: 20px;
          height: 20px;
          border: 1px solid #333;
        }
      `}</style>
    </div>
  );
}