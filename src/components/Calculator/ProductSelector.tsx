import React from 'react';

interface ProductSelectorProps {
  selectedProduct?: string;
  onProductChange?: (product: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  selectedProduct, 
  onProductChange 
}) => {
  const products = [
    { id: 'formatka', name: 'Formatka', description: 'Płyta cięta na wymiar' },
    { id: 'kaseton', name: 'Kaseton', description: 'Kaseton reklamowy' },
    { id: 'ledon', name: 'LEDON', description: 'Neon LED' },
    { id: 'ekspozytory', name: 'Ekspozytory', description: 'Ekspozytory reklamowe' },
    { id: 'gablota', name: 'Gablota', description: 'Gablota ekspozycyjna' },
    { id: 'pojemnik', name: 'Pojemnik', description: 'Pojemnik/Organizer' },
    { id: 'obudowa', name: 'Obudowa', description: 'Obudowa techniczna' },
    { id: 'impuls_kasowy', name: 'Impuls kasowy', description: 'Ekspozytor przykasowy' }
  ];

  return (
    <div className="product-selector">
      <h3 className="text-lg font-semibold mb-4">Wybierz produkt</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <button
            key={product.id}
            onClick={() => onProductChange?.(product.id)}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${selectedProduct === product.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};