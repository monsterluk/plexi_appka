// contexts/ViewModeContext.tsx

import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'client' | 'estimator';

interface ViewModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  isEstimatorMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('estimator');
  
  return (
    <ViewModeContext.Provider value={{
      mode,
      setMode,
      isEstimatorMode: mode === 'estimator'
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return context;
}