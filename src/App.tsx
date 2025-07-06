import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calculator } from './pages/Calculator';
import { ModernCalculator } from './pages/ModernCalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModernCalculator />} />
        <Route path="/old" element={<Calculator />} />
        <Route path="/monsterluk/plexi_appk" element={<Calculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;