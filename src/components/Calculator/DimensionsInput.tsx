import React from 'react';

interface DimensionsInputProps {
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
  };
  onDimensionsChange?: (dimensions: { width: number; height: number; depth?: number }) => void;
  showDepth?: boolean;
}

export const DimensionsInput: React.FC<DimensionsInputProps> = ({ 
  dimensions = { width: 1000, height: 500, depth: 0 },
  onDimensionsChange,
  showDepth = false
}) => {
  const handleChange = (field: 'width' | 'height' | 'depth', value: string) => {
    const numValue = parseInt(value) || 0;
    onDimensionsChange?.({
      ...dimensions,
      [field]: numValue
    });
  };

  return (
    <div className="dimensions-input">
      <h3 className="text-lg font-semibold mb-4">Wymiary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Szerokość (mm)
          </label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            max="3000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wysokość (mm)
          </label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            max="3000"
          />
        </div>
        
        {showDepth && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Głębokość (mm)
            </label>
            <input
              type="number"
              value={dimensions.depth || 0}
              onChange={(e) => handleChange('depth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
              max="1000"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          Powierzchnia: {((dimensions.width * dimensions.height) / 1000000).toFixed(2)} m²
        </p>
      </div>
    </div>
  );
};