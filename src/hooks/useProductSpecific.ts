// Hook for product-specific logic
// hooks/useProductSpecific.ts

import { useState, useCallback, useEffect } from 'react';
import { 
  ProductType, 
  ContainerOptions, 
  CabinetOptions, 
  EnclosureOptions,
  ImpulsOptions,
  KasetonOptions,
  LedonOptions
} from '../types/product.types';
import { EkspozytorOptions } from '../types/ekspozytory.types';

interface ProductSpecificState {
  containerOptions?: ContainerOptions;
  cabinetOptions?: CabinetOptions;
  enclosureOptions?: EnclosureOptions;
  impulsOptions?: ImpulsOptions;
  kasetonOptions?: KasetonOptions;
  ledonOptions?: LedonOptions;
  ekspozytorOptions?: EkspozytorOptions;
}

export function useProductSpecific(productType: ProductType) {
  const [state, setState] = useState<ProductSpecificState>({});

  // Inicjalizacja opcji dla produktu
  useEffect(() => {
    switch (productType) {
      case 'pojemnik':
        setState({
          containerOptions: {
            hasLid: false,
            partitions: {
              width: { enabled: false, count: 0 },
              length: { enabled: false, count: 0 }
            },
            hardware: { hinges: 0, locks: 0 }
          }
        });
        break;

      case 'gablota':
        setState({
          cabinetOptions: {
            customBase: { enabled: false },
            partitions: { enabled: false, count: 0, direction: 'horizontal' }
          }
        });
        break;

      case 'obudowa':
        setState({
          enclosureOptions: {
            walls: {
              front: true,
              back: true,
              left: true,
              right: true,
              top: true,
              bottom: true
            },
            features: {
              hasDoor: false,
              hasWindow: false,
              hasHandle: false
            }
          }
        });
        break;

      case 'ekspozytory':
        setState({
          ekspozytorOptions: undefined // Będzie ustawione po wyborze podtypu
        });
        break;

      case 'impuls_kasowy':
        setState({
          impulsOptions: {
            plexiType: 'clear',
            thickness: 3,
            shelvesCount: 2,
            graphics: { type: 'none' }
          }
        });
        break;

      case 'kaseton':
        setState({
          kasetonOptions: {
            type: 'plexi',
            letterType: 'podklejone',
            lighting: { type: 'none' },
            width: 1000,
            height: 500,
            quantity: 1
          }
        });
        break;

      case 'ledon':
        setState({
          ledonOptions: {
            plexiType: 'clear',
            ledLength: 5,
            text: 'LEDON',
            width: 600,
            height: 200,
            quantity: 1,
            features: {
              rgb: false,
              waterproof: false,
              complexProject: false,
              powerSupply: false
            }
          }
        });
        break;

      default:
        setState({});
    }
  }, [productType]);

  // Funkcje aktualizacji
  const updateContainerOptions = useCallback((updates: Partial<ContainerOptions>) => {
    setState(prev => ({
      ...prev,
      containerOptions: { ...prev.containerOptions!, ...updates }
    }));
  }, []);

  const updateCabinetOptions = useCallback((updates: Partial<CabinetOptions>) => {
    setState(prev => ({
      ...prev,
      cabinetOptions: { ...prev.cabinetOptions!, ...updates }
    }));
  }, []);

  const updateEnclosureOptions = useCallback((updates: Partial<EnclosureOptions>) => {
    setState(prev => ({
      ...prev,
      enclosureOptions: { ...prev.enclosureOptions!, ...updates }
    }));
  }, []);

  const updateEkspozytorOptions = useCallback((options: EkspozytorOptions) => {
    setState(prev => ({
      ...prev,
      ekspozytorOptions: options
    }));
  }, []);

  const updateImpulsOptions = useCallback((updates: Partial<ImpulsOptions>) => {
    setState(prev => ({
      ...prev,
      impulsOptions: { ...prev.impulsOptions!, ...updates }
    }));
  }, []);

  const updateKasetonOptions = useCallback((updates: Partial<KasetonOptions>) => {
    setState(prev => ({
      ...prev,
      kasetonOptions: { ...prev.kasetonOptions!, ...updates }
    }));
  }, []);

  const updateLedonOptions = useCallback((updates: Partial<LedonOptions>) => {
    setState(prev => ({
      ...prev,
      ledonOptions: { ...prev.ledonOptions!, ...updates }
    }));
  }, []);

  // Walidacja opcji
  const validateOptions = useCallback(() => {
    const errors: string[] = [];

    switch (productType) {
      case 'pojemnik':
        if (state.containerOptions?.partitions.width.enabled && 
            state.containerOptions.partitions.width.count < 1) {
          errors.push('Liczba przegród poprzecznych musi być większa od 0');
        }
        if (state.containerOptions?.partitions.length.enabled && 
            state.containerOptions.partitions.length.count < 1) {
          errors.push('Liczba przegród podłużnych musi być większa od 0');
        }
        break;

      case 'ekspozytory':
        if (!state.ekspozytorOptions) {
          errors.push('Wybierz typ ekspozytora');
        } else {
          switch (state.ekspozytorOptions.subtype) {
            case 'schodkowy':
              if (state.ekspozytorOptions.levels < 2) {
                errors.push('Ekspozytor schodkowy musi mieć minimum 2 poziomy');
              }
              break;
            case 'z_haczykami':
              if (state.ekspozytorOptions.hooksCount < 1) {
                errors.push('Podaj liczbę haczyków');
              }
              break;
            case 'kosmetyczny':
              if (state.ekspozytorOptions.shelvesWithHoles < 1) {
                errors.push('Ekspozytor kosmetyczny musi mieć minimum 1 półkę z otworami');
              }
              if (state.ekspozytorOptions.holesPerShelf < 2) {
                errors.push('Minimalna liczba otworów na półkę to 2');
              }
              break;
          }
        }
        break;

      case 'impuls_kasowy':
        if (state.impulsOptions && state.impulsOptions.shelvesCount < 2) {
          errors.push('Impuls kasowy musi mieć minimum 2 półki');
        }
        break;

      case 'obudowa':
        const walls = state.enclosureOptions?.walls;
        if (walls) {
          const wallCount = Object.values(walls).filter(Boolean).length;
          if (wallCount < 3) {
            errors.push('Obudowa musi mieć minimum 3 ściany');
          }
        }
        break;
    }

    return errors;
  }, [productType, state]);

  // Określanie widoczności opcji
  const getVisibleFields = useCallback(() => {
    const fields: string[] = [];

    switch (productType) {
      case 'ekspozytory':
        if (state.ekspozytorOptions) {
          // Wspólne pola
          fields.push('material', 'thickness', 'graphics', 'quantity');
          
          // Pola specyficzne dla podtypu
          switch (state.ekspozytorOptions.subtype) {
            case 'podstawkowy':
              fields.push('hasSides', 'hasLaczniki');
              break;
            case 'schodkowy':
              fields.push('levels', 'hasBack');
              break;
            case 'z_haczykami':
              fields.push('hooksCount', 'hasBase', 'hasSides');
              if (state.ekspozytorOptions.hasBase) {
                fields.push('baseDepth');
              }
              break;
            case 'wiszacy':
              fields.push('shelvesCount', 'shelfDepth', 'hasSides', 'mountingType');
              break;
            case 'stojak':
              fields.push('shelvesCount', 'shelfDepth', 'hasSides');
              break;
            case 'kosmetyczny':
              fields.push('hasSecondBottom', 'shelvesWithHoles', 'holesPerShelf', 
                         'hasTopper', 'hasDividers');
              if (state.ekspozytorOptions.hasTopper) {
                fields.push('topperHeight', 'topperGraphics');
              }
              if (state.ekspozytorOptions.hasDividers) {
                fields.push('dividersCount');
              }
              break;
          }
        }
        break;

      case 'pojemnik':
        fields.push('material', 'thickness', 'hasLid', 'partitions', 'hardware');
        break;

      case 'gablota':
        fields.push('material', 'thickness', 'customBase', 'partitions');
        if (state.cabinetOptions?.customBase?.enabled) {
          fields.push('baseMaterial', 'baseThickness');
        }
        break;

      case 'obudowa':
        fields.push('material', 'thickness', 'walls', 'features');
        break;

      case 'impuls_kasowy':
        fields.push('plexiType', 'thickness', 'shelvesCount', 'graphics');
        break;

      case 'kaseton':
        fields.push('type', 'letterType', 'lighting');
        if (state.kasetonOptions?.lighting?.type !== 'none') {
          fields.push('lightingPower');
        }
        break;

      case 'ledon':
        fields.push('plexiType', 'thickness', 'ledType', 'ledLength', 'features');
        break;

      default:
        fields.push('material', 'thickness');
    }

    return fields;
  }, [productType, state]);

  return {
    ...state,
    updateContainerOptions,
    updateCabinetOptions,
    updateEnclosureOptions,
    updateEkspozytorOptions,
    updateImpulsOptions,
    updateKasetonOptions,
    updateLedonOptions,
    validateOptions,
    getVisibleFields
  };
}