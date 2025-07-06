import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Calculator } from './pages/Calculator';
import { AppLayout } from './components/Layout/AppLayout';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/monsterluk/plexi_appk" element={<Calculator />} />
        </Routes>
        <ThemeToggle />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;