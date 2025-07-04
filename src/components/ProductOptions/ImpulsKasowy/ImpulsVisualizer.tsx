// components/ProductOptions/ImpulsKasowy/ImpulsVisualizer.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImpulsKasowyOptions } from '../../../types/impuls.types';
import { Eye, Move3d, Package } from 'lucide-react';
import styles from './ImpulsVisualizer.module.css';

interface Props {
  dimensions: { width: number; height: number; depth: number };
  options: ImpulsKasowyOptions;
  shelfSpacing: number;
}

export const ImpulsVisualizer: React.FC<Props> = ({
  dimensions,
  options,
  shelfSpacing
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'front' | 'side'>('3d');
  const [rotation, setRotation] = useState({ x: -20, y: 25 });

  // Skalowanie dla wizualizacji
  const scale = Math.min(300 / dimensions.width, 400 / dimensions.height, 0.5);
  const w = dimensions.width * scale;
  const h = dimensions.height * scale;
  const d = dimensions.depth * scale;
  const limiterH = options.limiterHeight * scale;

  const renderShelf = (index: number, yPosition: number) => {
    const key = `shelf-${index}`;
    
    if (viewMode === '3d') {
      return (
        <g key={key}>
          {/* Półka */}
          <path
            d={`M ${-w/2},${yPosition} 
                L ${-w/2+d*0.5},${yPosition-d*0.3}
                L ${w/2+d*0.5},${yPosition-d*0.3} 
                L ${w/2},${yPosition} Z`}
            fill="#ffb74d"
            stroke="#f57c00"
            strokeWidth="2"
          />
          
          {/* Ogranicznik (przód) */}
          <path
            d={`M ${-w/2},${yPosition} 
                L ${-w/2},${yPosition-limiterH}
                L ${w/2},${yPosition-limiterH} 
                L ${w/2},${yPosition} Z`}
            fill="#ff9800"
            stroke="#e65100"
            strokeWidth="2"
          />
          
          {/* Tekst */}
          <text
            x="0"
            y={yPosition - d*0.15}
            textAnchor="middle"
            fontSize="10"
            fill="#333"
          >
            Półka {index + 1}
          </text>
        </g>
      );
    } else if (viewMode === 'side') {
      return (
        <g key={key}>
          {/* Półka z boku */}
          <rect
            x={0}
            y={yPosition - 5}
            width={d}
            height={10}
            fill="#ffb74d"
            stroke="#f57c00"
            strokeWidth="1"
          />
          
          {/* Ogranicznik z boku */}
          <rect
            x={d - 5}
            y={yPosition - limiterH}
            width={5}
            height={limiterH}
            fill="#ff9800"
            stroke="#e65100"
            strokeWidth="1"
          />
        </g>
      );
    }
    
    return null;
  };

  const render3DView = () => (
    <g transform={`translate(200, 200) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}>
      {/* Plecy */}
      <path
        d={`M ${-w/2},${-h/2} 
            L ${-w/2+d*0.5},${-h/2-d*0.3}
            L ${-w/2+d*0.5},${h/2-d*0.3} 
            L ${-w/2},${h/2} Z`}
        fill={options.plexiType === 'white' ? '#f5f5f5' : '#e3f2fd'}
        stroke="#1976d2"
        strokeWidth="2"
        opacity={options.plexiType === 'clear' ? 0.7 : 1}
      />
      
      {/* Lewy bok */}
      <path
        d={`M ${-w/2},${-h/2} 
            L ${-w/2},${h/2}
            L ${-w/2-d*0.5},${h/2+d*0.3} 
            L ${-w/2-d*0.5},${-h/2+d*0.3} Z`}
        fill={options.plexiType === 'white' ? '#f5f5f5' : '#bbdefb'}
        stroke="#1976d2"
        strokeWidth="2"
        opacity={options.plexiType === 'clear' ? 0.7 : 1}
      />
      
      {/* Prawy bok */}
      <path
        d={`M ${w/2+d*0.5},${-h/2-d*0.3} 
            L ${w/2+d*0.5},${h/2-d*0.3}
            L ${w/2},${h/2} 
            L ${w/2},${-h/2} Z`}
        fill={options.plexiType === 'white' ? '#f5f5f5' : '#bbdefb'}
        stroke="#1976d2"
        strokeWidth="2"
        opacity={options.plexiType === 'clear' ? 0.7 : 1}
      />
      
      {/* Półki */}
      {Array.from({ length: options.shelvesCount }, (_, i) => {
        const yPos = -h/2 + shelfSpacing * (i + 1) * scale;
        return renderShelf(i, yPos);
      })}
      
      {/* Grafika (jeśli włączona) */}
      {options.graphics.enabled && (
        <g opacity="0.3">
          <rect
            x={-w/2 + 5}
            y={-h/2 + 5}
            width={w - 10}
            height={h - 10}
            fill="url(#graphicsPattern)"
            stroke="#4caf50"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text
            x={0}
            y={-h/2 + 30}
            textAnchor="middle"
            fontSize="12"
            fill="#4caf50"
            fontWeight="bold"
          >
            GRAFIKA
          </text>
        </g>
      )}
    </g>
  );

  const renderFrontView = () => (
    <g transform="translate(200, 200)">
      {/* Kontur */}
      <rect
        x={-w/2}
        y={-h/2}
        width={w}
        height={h}
        fill="none"
        stroke="#1976d2"
        strokeWidth="2"
      />
      
      {/* Półki - widok z przodu */}
      {Array.from({ length: options.shelvesCount }, (_, i) => {
        const yPos = -h/2 + shelfSpacing * (i + 1) * scale;
        return (
          <g key={`front-shelf-${i}`}>
            <line
              x1={-w/2}
              y1={yPos}
              x2={w/2}
              y2={yPos}
              stroke="#f57c00"
              strokeWidth="2"
            />
            <rect
              x={-w/2}
              y={yPos - limiterH}
              width={w}
              height={limiterH}
              fill="#ff9800"
              opacity="0.8"
            />
            <text
              x={0}
              y={yPos - limiterH/2}
              textAnchor="middle"
              fontSize="10"
              fill="white"
            >
              {options.limiterHeight}mm
            </text>
          </g>
        );
      })}
    </g>
  );

  const renderSideView = () => (
    <g transform="translate(100, 200)">
      {/* Kontur boczny */}
      <rect
        x={0}
        y={-h/2}
        width={d}
        height={h}
        fill="none"
        stroke="#1976d2"
        strokeWidth="2"
      />
      
      {/* Półki - widok z boku */}
      {Array.from({ length: options.shelvesCount }, (_, i) => {
        const yPos = -h/2 + shelfSpacing * (i + 1) * scale;
        return renderShelf(i, yPos);
      })}
      
      {/* Wymiary */}
      <g className={styles.dimensions}>
        <line
          x1={d + 20}
          y1={-h/2}
          x2={d + 20}
          y2={h/2}
          stroke="#666"
          strokeWidth="1"
        />
        <text
          x={d + 30}
          y={0}
          textAnchor="start"
          fontSize="12"
          fill="#666"
          transform={`rotate(90 ${d + 30} 0)`}
        >
          {dimensions.height} mm
        </text>
      </g>
    </g>
  );

  return (
    <div className={styles.visualizer}>
      <div className={styles.controls}>
        <button
          className={`${styles.viewButton} ${viewMode === '3d' ? styles.active : ''}`}
          onClick={() => setViewMode('3d')}
        >
          <Move3d size={18} />
          <span>3D</span>
        </button>
        <button
          className={`${styles.viewButton} ${viewMode === 'front' ? styles.active : ''}`}
          onClick={() => setViewMode('front')}
        >
          <Package size={18} />
          <span>Przód</span>
        </button>
        <button
          className={`${styles.viewButton} ${viewMode === 'side' ? styles.active : ''}`}
          onClick={() => setViewMode('side')}
        >
          <Eye size={18} />
          <span>Bok</span>
        </button>
      </div>

      <div 
        className={styles.canvas}
        onMouseMove={(e) => {
          if (viewMode === '3d' && e.buttons === 1) {
            setRotation({
              x: rotation.x - e.movementY * 0.5,
              y: rotation.y + e.movementX * 0.5
            });
          }
        }}
      >
        <svg viewBox="0 0 400 400" width="100%" height="400">
          <defs>
            <pattern id="graphicsPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="white" />
              <text x="20" y="25" textAnchor="middle" fontSize="8" fill="#4caf50">LOGO</text>
            </pattern>
          </defs>

          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === '3d' && render3DView()}
            {viewMode === 'front' && renderFrontView()}
            {viewMode === 'side' && renderSideView()}
          </motion.g>
        </svg>

        {viewMode === '3d' && (
          <p className={styles.hint}>
            Przeciągnij myszką aby obrócić widok
          </p>
        )}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.colorBox} style={{ background: '#e3f2fd' }} />
          <span>Plexi {options.plexiType === 'clear' ? 'bezbarwna' : 'biała'}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.colorBox} style={{ background: '#ffb74d' }} />
          <span>Półki</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.colorBox} style={{ background: '#ff9800' }} />
          <span>Ograniczniki</span>
        </div>
      </div>
    </div>
  );
};