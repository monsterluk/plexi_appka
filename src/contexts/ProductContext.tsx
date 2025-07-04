// contexts/ProductContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType } from '../types/product.types';

interface ProductContextType {
  selectedProductType: ProductType | null;
  setSelectedProductType: (type: ProductType | null) => void;
  productOptions: Record<string, any>;
  updateProductOptions: (type: ProductType, options: any) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [productOptions, setProductOptions] = useState<Record<string, any>>({});

  const updateProductOptions = (type: ProductType, options: any) => {
    setProductOptions(prev => ({
      ...prev,
      [type]: options
    }));
  };

  return (
    <ProductContext.Provider value={{
      selectedProductType,
      setSelectedProductType,
      productOptions,
      updateProductOptions
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider');
  }
  return context;
};