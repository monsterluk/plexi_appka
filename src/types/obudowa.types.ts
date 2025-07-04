// types/obudowa.types.ts

import { MaterialSpec } from './calculator.types';

export interface WallConfig {
  enabled: boolean;
  material?: MaterialSpec;
  thickness?: number;
  hasVentilation?: boolean;
  hasCableHoles?: boolean;
}

export interface ObudowaOptions {
  // Konfiguracja ścian
  walls: {
    front: WallConfig;
    back: WallConfig;
    left: WallConfig;
    right: WallConfig;
    top: WallConfig;
    bottom: WallConfig;
  };
  
  // Opcje funkcjonalne
  features: {
    hasDoor: boolean;
    doorSide?: 'front' | 'left' | 'right';
    hasWindow: boolean;
    windowSize?: { width: number; height: number };
    hasHandle: boolean;
    hasCoolingFan: boolean;
    fanCount?: number;
  };
  
  // Opcje montażowe
  mounting: {
    type: 'wall' | 'floor' | 'ceiling' | 'standalone';
    hasRails: boolean;
    hasBrackets: boolean;
  };
  
  // Materiał domyślny
  defaultMaterial: MaterialSpec;
  defaultThickness: number;
}

export interface ObudowaValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  wallCount: number;
}