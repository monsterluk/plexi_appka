export type ProductType = 
  | 'formatka'
  | 'kaseton'
  | 'ledon'
  | 'ekspozytory'
  | 'gablota'
  | 'impuls'
  | 'plyta'
  | 'pojemnik'
  | 'obudowa'
  | 'impuls_kasowy';

// Wymiary
export interface Dimensions {
  width: number;  // mm
  height: number; // mm
  depth: number;  // mm
}

export interface FormatkaOptions {
  material: 'plexi' | 'dibond' | 'pcv';
  thickness: number;
  graphics?: boolean;
  cutting?: boolean;
  quantity?: number;
  width?: number;
  height?: number;
  finishing?: {
    polishedEdges?: boolean;
    roundedCorners?: boolean;
    drillHoles?: number;
  };
}

export interface KasetonOptions {
  type: 'plexi' | 'dibond';
  letterType: 'podklejone' | 'zlicowane' | 'wystajace' | 'halo';
  lighting: {
    type: 'none' | 'led' | 'neon';
    power?: number;
  };
  graphics?: boolean;
  depth?: number;
  width: number;
  height: number;
  quantity: number;
}

export interface DisplayOptions {
  type: 'podstawkowy' | 'schodkowy' | 'z_haczykami' | 'kosmetyczny';
  specific: {
    hooksCount?: number;
    shelvesCount?: number;
  };
}

export interface LedonOptions {
  plexiType: 'clear' | 'milky' | 'black';
  text: string;
  fontSize?: number;
  fontType?: string;
  fontStyle?: string;
  size?: {
    width: number;
    height: number;
  };
  ledColor?: string;
  ledLength?: number;
  features?: {
    waterproof?: boolean;
    dimmer?: boolean;
    remoteControl?: boolean;
    mounting?: 'wall' | 'hanging' | 'standing';
    rgb?: boolean;
    complexProject?: boolean;
    powerSupply?: boolean;
  };
  lighting?: {
    type: 'led' | 'neon';
    color?: string;
  };
  width: number;
  height: number;
  quantity: number;
}

export interface ContainerOptions {
  material: 'plexi' | 'hips' | 'petg' | 'pc';
  thickness: number;
  width: number;
  height: number;
  depth: number;
  quantity: number;
  hasLid: boolean;
  lidType?: 'hinged' | 'removable';
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
  hardware?: {
    hinges: number;
    locks: number;
  };
}

export interface EnclosureOptions {
  walls: {
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
  features?: any;
}

export interface CabinetOptions {
  customBase?: {
    enabled: boolean;
    material?: any;
    thickness?: number;
  };
  partitions?: {
    enabled: boolean;
    count: number;
    direction: 'horizontal' | 'vertical';
  };
}

export interface ImpulsOptions {
  plexiType: 'clear' | 'white';
  thickness: number;
  shelvesCount: number;
  graphics: {
    type: 'none' | 'single' | 'double';
  };
}