// Results component for displaying calculation results
// components/Calculator/Results.tsx

import { useViewMode } from '../../contexts/ViewModeContext';

export function Results({ results }: Props) {
  const { isEstimatorMode } = useViewMode();
  
  return (
    <div className="results">
      <h2>Podsumowanie</h2>
      
      {/* Szczegóły tylko dla kosztorysanta */}
      {isEstimatorMode && (
        <div className="estimator-details">
          <h3>Szczegóły kalkulacji</h3>
          <p>Koszt materiału: {results.material.cost.toFixed(2)} zł</p>
          <p>Marża: {results.material.wastePercentage * 100}%</p>
          <p>Mnożnik: {results.multiplierUsed}</p>
        </div>
      )}
      
      {/* Informacje dla klienta */}
      <div className="client-info">
        <p>Powierzchnia: {results.material.surface.toFixed(2)} m²</p>
        <p>Waga: {results.material.weight.toFixed(2)} kg</p>
        <h3>Cena netto: {results.summary.totalNetto.toFixed(2)} zł</h3>
        <h3>Cena brutto: {results.summary.totalBrutto.toFixed(2)} zł</h3>
      </div>
    </div>
  );
}