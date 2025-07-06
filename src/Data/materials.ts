// data/materials.ts

export const materials = [
  {
    id: 1,
    nazwa: 'Plexi 3mm',
    cena_za_m2: 120,
    name: 'Plexi 3mm',
    pricePerM2: 120,
    density: 1190
  },
  {
    id: 2,
    nazwa: 'Plexi 5mm',
    cena_za_m2: 180,
    name: 'Plexi 5mm',
    pricePerM2: 180,
    density: 1190
  },
  {
    id: 3,
    nazwa: 'Plexi 8mm',
    cena_za_m2: 280,
    name: 'Plexi 8mm',
    pricePerM2: 280,
    density: 1190
  },
  {
    id: 4,
    nazwa: 'Plexi 10mm',
    cena_za_m2: 350,
    name: 'Plexi 10mm',
    pricePerM2: 350,
    density: 1190
  },
  {
    id: 5,
    nazwa: 'Dibond 3mm',
    cena_za_m2: 150,
    name: 'Dibond 3mm',
    pricePerM2: 150,
    density: 1500
  },
  {
    id: 6,
    nazwa: 'PCV 5mm',
    cena_za_m2: 100,
    name: 'PCV 5mm',
    pricePerM2: 100,
    density: 1400
  }
];

export const specialMaterials = [
    {
      id: 101,
      nazwa: 'Plexi kolorowa 3mm',
      cena_za_m2: 120, // Poprawna cena
      dostepne_grubosci: [3], // Tylko 3mm
      gestosc: 1190,
      fixedThickness: true
    },
    {
      id: 102,
      nazwa: 'Plexi kolorowa 5mm',
      cena_za_m2: 200, // Poprawna cena
      dostepne_grubosci: [5], // Tylko 5mm
      gestosc: 1190,
      fixedThickness: true
    }
  ];