// Product types for plexi_appka

export type ProductType = 'container' | 'cabinet' | 'enclosure' | 'wall';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
}

export interface ProductConfig {
  wallThickness: number;
  edgeThickness: number;
  minDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}
