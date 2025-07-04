// Product definitions for plexi_appka

export const PRODUCT_TYPES = {
  CONTAINER: 'container',
  CABINET: 'cabinet',
  ENCLOSURE: 'enclosure',
  WALL: 'wall'
} as const;

export const CONTAINER_TYPES = {
  RECTANGULAR: 'rectangular',
  CYLINDRICAL: 'cylindrical',
  CUSTOM: 'custom'
} as const;

export const CABINET_TYPES = {
  KITCHEN: 'kitchen',
  BATHROOM: 'bathroom',
  OFFICE: 'office',
  DISPLAY: 'display'
} as const;

export const ENCLOSURE_TYPES = {
  ELECTRICAL: 'electrical',
  SECURITY: 'security',
  DECORATIVE: 'decorative',
  PROTECTIVE: 'protective'
} as const;

export const WALL_TYPES = {
  PARTITION: 'partition',
  DECORATIVE: 'decorative',
  SHOWER: 'shower',
  OFFICE: 'office'
} as const;

export const PRODUCT_CONFIGURATIONS = {
  [PRODUCT_TYPES.CONTAINER]: {
    name: 'Pojemnik',
    description: 'Pojemniki z pleksi do przechowywania',
    types: CONTAINER_TYPES,
    defaultDimensions: { width: 200, height: 150, depth: 100 },
    hasLid: true,
    hasBase: true
  },
  [PRODUCT_TYPES.CABINET]: {
    name: 'Szafka',
    description: 'Szafki i meble z pleksi',
    types: CABINET_TYPES,
    defaultDimensions: { width: 600, height: 800, depth: 400 },
    hasDoors: true,
    hasShelves: true
  },
  [PRODUCT_TYPES.ENCLOSURE]: {
    name: 'Obudowa',
    description: 'Obudowy ochronne z pleksi',
    types: ENCLOSURE_TYPES,
    defaultDimensions: { width: 300, height: 200, depth: 150 },
    hasVentilation: true,
    hasAccess: true
  },
  [PRODUCT_TYPES.WALL]: {
    name: 'Ściana',
    description: 'Ściany działowe z pleksi',
    types: WALL_TYPES,
    defaultDimensions: { width: 1200, height: 2000, depth: 10 },
    hasFrame: true,
    isModular: true
  }
} as const;

export const COMPLEXITY_LEVELS = {
  SIMPLE: 'simple',
  MEDIUM: 'medium',
  COMPLEX: 'complex'
} as const;

export const DEFAULT_THICKNESS = 5; // mm
export const MIN_THICKNESS = 3; // mm
export const MAX_THICKNESS = 20; // mm
