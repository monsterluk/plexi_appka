import React, { useState } from 'react';

export const TestCalculator: React.FC = () => {
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(500);
  const [result, setResult] = useState(0);

  const calculate = () => {
    const area = (width * height) / 1000000; // m²
    const pricePerM2 = 250; // przykładowa cena
    const total = area * pricePerM2;
    setResult(total);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h2>Test Kalkulatora</h2>
      <div>
        <label>Szerokość (mm):</label>
        <input 
          type="number" 
          value={width} 
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ margin: '10px', padding: '5px' }}
        />
      </div>
      <div>
        <label>Wysokość (mm):</label>
        <input 
          type="number" 
          value={height} 
          onChange={(e) => setHeight(Number(e.target.value))}
          style={{ margin: '10px', padding: '5px' }}
        />
      </div>
      <button onClick={calculate} style={{ margin: '10px' }}>
        Oblicz
      </button>
      {result > 0 && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Cena: {result.toFixed(2)} zł
        </div>
      )}
    </div>
  );
};