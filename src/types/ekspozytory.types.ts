// types/ekspozytory.types.ts

export type EkspozytorSubtype = 
  | 'podstawkowy' 
  | 'schodkowy' 
  | 'z_haczykami' 
  | 'wiszacy' 
  | 'stojak' 
  | 'kosmetyczny';

export interface BaseEkspozytorOptions {
  subtype: EkspozytorSubtype;
  material: 'bezbarwna' | 'mleczna' | 'czarna' | 'biala' | 'kolorowa_3mm' | 'kolorowa_5mm';
  thickness: number;
  graphics: 'none' | 'single' | 'double';
  quantity: number;
}

export interface PodstawkowyOptions extends BaseEkspozytorOptions {
  subtype: 'podstawkowy';
  hasSides: boolean;
  hasLaczniki: boolean;
}

export interface SchodkowyOptions extends BaseEkspozytorOptions {
  subtype: 'schodkowy';
  levels: number; // min 2
  hasBack: boolean;
}

export interface ZHaczykamiOptions extends BaseEkspozytorOptions {
  subtype: 'z_haczykami';
  hooksCount: number;
  hasBase: boolean;
  hasSides: boolean;
  baseDepth?: number;
}

export interface WiszacyOptions extends BaseEkspozytorOptions {
  subtype: 'wiszacy';
  shelvesCount: number;
  shelfDepth: number;
  hasSides: boolean;
  mountingType: 'hooks' | 'magnets' | 'screws';
}

export interface StojakOptions extends BaseEkspozytorOptions {
  subtype: 'stojak';
  shelvesCount: number;
  shelfDepth: number;
  hasSides: boolean;
}

export interface KosmetycznyOptions extends BaseEkspozytorOptions {
  subtype: 'kosmetyczny';
  hasSecondBottom: boolean;
  shelvesWithHoles: number;
  holesPerShelf: number;
  hasTopper: boolean;
  topperHeight?: number;
  topperGraphics?: 'none' | 'single' | 'double';
  hasDividers: boolean;
  dividersCount?: number;
}

export type EkspozytorOptions = 
  | PodstawkowyOptions 
  | SchodkowyOptions 
  | ZHaczykamiOptions 
  | WiszacyOptions 
  | StojakOptions 
  | KosmetycznyOptions;