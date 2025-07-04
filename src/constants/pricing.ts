// Pricing constants for plexi_appka

export const PRICING_CONFIG = {
  // Base pricing factors
  materialMarkup: 1.2, // 20% markup on material cost
  laborCostPerHour: 80.0, // PLN per hour
  complexityMultiplier: {
    simple: 1.0,
    medium: 1.3,
    complex: 1.6
  },
  
  // Processing costs
  cuttingCostPerMeter: 15.0, // PLN per meter of cutting
  edgingCostPerMeter: 8.0, // PLN per meter of edge polishing
  drillingCostPerHole: 5.0, // PLN per hole
  
  // Minimum order values
  minimumOrderValue: 100.0, // PLN
  smallOrderSurcharge: 25.0, // PLN for orders under minimum
  
  // Delivery costs
  deliveryCost: {
    local: 0.0, // Free local delivery
    regional: 35.0, // Within 50km
    national: 75.0 // Nationwide
  },
  
  // Volume discounts
  volumeDiscounts: {
    over500: 0.05, // 5% discount
    over1000: 0.08, // 8% discount
    over2000: 0.12 // 12% discount
  }
};

export const VAT_RATE = 0.23; // 23% VAT in Poland
