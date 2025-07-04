// Surface area calculations for plexi_appka

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface RectangularSurface {
  width: number;
  height: number;
}

interface CircularSurface {
  radius: number;
}

/**
 * Calculate surface area of a rectangular container
 */
export function calculateRectangularContainerSurface(dimensions: Dimensions): number {
  const { width, height, depth } = dimensions;
  
  // Bottom and top
  const topBottom = 2 * (width * depth);
  
  // Front and back
  const frontBack = 2 * (width * height);
  
  // Left and right sides
  const sides = 2 * (depth * height);
  
  return topBottom + frontBack + sides;
}

/**
 * Calculate surface area of a cylindrical container
 */
export function calculateCylindricalContainerSurface(radius: number, height: number): number {
  // Base and top circles
  const circles = 2 * Math.PI * radius * radius;
  
  // Curved side surface
  const curved = 2 * Math.PI * radius * height;
  
  return circles + curved;
}

/**
 * Calculate surface area of a rectangular sheet
 */
export function calculateRectangularSurface(surface: RectangularSurface): number {
  return surface.width * surface.height;
}

/**
 * Calculate surface area of a circular sheet
 */
export function calculateCircularSurface(surface: CircularSurface): number {
  return Math.PI * surface.radius * surface.radius;
}

/**
 * Calculate total surface area for cabinet with doors and shelves
 */
export function calculateCabinetSurface(
  dimensions: Dimensions,
  numberOfShelves: number = 0,
  numberOfDoors: number = 1
): number {
  const { width, height, depth } = dimensions;
  
  // Basic box structure (without front)
  const back = width * height;
  const topBottom = 2 * (width * depth);
  const sides = 2 * (depth * height);
  
  // Shelves
  const shelves = numberOfShelves * (width * depth);
  
  // Doors
  const doors = numberOfDoors * (width * height);
  
  return back + topBottom + sides + shelves + doors;
}

/**
 * Calculate surface area for partition walls
 */
export function calculateWallSurface(
  width: number,
  height: number,
  numberOfPanels: number = 1
): number {
  return width * height * numberOfPanels;
}

/**
 * Calculate surface area with waste factor
 */
export function calculateSurfaceWithWaste(
  baseSurface: number,
  wasteFactor: number = 0.1
): number {
  return baseSurface * (1 + wasteFactor);
}
