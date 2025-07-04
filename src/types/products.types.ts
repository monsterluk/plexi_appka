// Product types for plexi_appka

// types/products.types.ts

export type ProductType = 
  | 'plyta' 
  | 'pojemnik' 
  | 'gablota' 
  | 'obudowa' 
  | 'kaseton' 
  | 'ledon' 
  | 'ekspozytory' 
  | 'impuls_kasowy';

// Pojemnik
export interface ContainerOptions {
  hasLid: boolean;
  partitions: {
    width: {
      enabled: boolean;
      count: number;
    };
    length: {
      enabled: boolean;
      count: number;
    };
  };
  hardware: {
    hinges: number;
    locks: number;
  };
}

// Gablota
export interface CabinetOptions {
  customBase: {
    enabled: boolean;
    material?: MaterialSpec;
    thickness?: number;
  };
  partitions: {
    enabled: boolean;
    count: number;
    direction: 'horizontal' | 'vertical';
  };
}

// Obudowa
export interface EnclosureOptions {
  walls: {
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
  features: {
    hasDoor: boolean;
    hasWindow: boolean;
    hasHandle: boolean;
  };
}

// Impuls kasowy
export interface ImpulsOptions {
  plexiType: 'clear' | 'white';
  thickness: number;
  shelvesCount: number; // min 2
  graphics: {
    type: 'none' | 'single' | 'double';
  };
}

// Kaseton
export interface KasetonOptions {
  type: 'plexi' | 'dibond';
  letterType: 'podklejone' | 'zlicowane' | 'wystajace' | 'halo';
  lighting: {
    type: 'none' | 'led' | 'halo';
    power?: number; // W
  };
}

// LEDON
export interface LedonOptions {
  plexiType: 'clear' | 'milky' | 'black';
  thickness: number;
  ledType: 'standard' | 'neonflex';
  ledLength: number; // metry
  features: {
    rgb: boolean;
    waterproof: boolean;
    complexProject: boolean;
    powerSupply: boolean;
  };
}

// Ekspozytory
export interface DisplayOptions {
  type: 'podstawkowy' | 'schodkowy' | 'z_haczykami' | 'wiszacy' | 'stojak' | 'kosmetyczny';
  thickness: number;
  // Opcje wspólne
  graphics: 'none' | 'single' | 'double';
  // Opcje specyficzne dla typów
  specific: {
    // podstawkowy
    hasSides?: boolean;
    // schodkowy
    levels?: number;
    // z_haczykami
    hooksCount?: number;
    hasBase?: boolean;
    // kosmetyczny
    hasSecondBottom?: boolean;
    shelvesWithHoles?: number;
    topperHeight?: number;
  };
}
// types/product.types.ts

export type ProductType = 'formatka' | 'kaseton' | 'ledon' | 'pojemnik' | 'gablota' | 'obudowa' | 'impuls_kasowy' | 'ekspozytory';

export interface BaseProductOptions {
  quantity: number;
  notes?: string;
}

export interface FormatkaOptions extends BaseProductOptions {
  material: 'plexi' | 'hips' | 'petg' | 'pc';
  thickness: number;
  width: number;
  height: number;
  finishing: {
    polishedEdges: boolean;
    roundedCorners: boolean;
    drillHoles: number;
  };
}

export interface KasetonOptions extends BaseProductOptions {
  type: 'plexi' | 'dibond';
  width: number;
  height: number;
  depth: number;
  letterType: 'podklejone' | 'zlicowane' | 'wystajace' | 'halo';
  lighting: {
    type: 'none' | 'led' | 'neon';
    power?: number;
  };
  graphics: boolean;
}

export interface LedonOptions extends BaseProductOptions {
  text: string;
  fontStyle: 'standard' | 'script' | 'bold' | 'custom';
  size: {
    width: number;
    height: number;
  };
  plexiType: 'clear' | 'milky' | 'black';
  ledColor: 'white' | 'warm' | 'rgb' | 'custom';
  features: {
    waterproof: boolean;
    dimmer: boolean;
    remoteControl: boolean;
    mounting: 'wall' | 'hanging' | 'standing';
  };
}