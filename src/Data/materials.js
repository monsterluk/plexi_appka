// data/materials.js

export const materials = [
    {
      id: 1,
      nazwa: 'PET-G / Plexi bezbarwna',
      cena_za_m2: 30,
      wspolczynnik_trudnosci: 1.19,
      dostepne_grubosci: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
      gestosc: 1190 // kg/m³
    },
    {
      id: 2,
      nazwa: 'PET-G / Plexi mleczna',
      cena_za_m2: 32,
      wspolczynnik_trudnosci: 1.19,
      dostepne_grubosci: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
      gestosc: 1190
    },
    {
      id: 3,
      nazwa: 'PET-G / Plexi kolorowa',
      cena_za_m2: 35,
      wspolczynnik_trudnosci: 1.25,
      dostepne_grubosci: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
      gestosc: 1190
    },
    {
      id: 4,
      nazwa: 'Poliwęglan bezbarwny',
      cena_za_m2: 45,
      wspolczynnik_trudnosci: 1.30,
      dostepne_grubosci: [2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
      gestosc: 1200
    },
    {
      id: 5,
      nazwa: 'Poliwęglan mleczny',
      cena_za_m2: 47,
      wspolczynnik_trudnosci: 1.30,
      dostepne_grubosci: [2, 3, 4, 5, 6, 8, 10, 12, 15, 20],
      gestosc: 1200
    },
    {
      id: 6,
      nazwa: 'Dibond',
      cena_za_m2: 55,
      wspolczynnik_trudnosci: 1.40,
      dostepne_grubosci: [3, 4, 6],
      gestosc: 1500
    }
  ];
  
  export const addons = [
    {
      id: 1,
      nazwa: 'Wiercenie otworów',
      typ: 'obrobka',
      cena: 2.00,
      jednostka: 'otwory'
    },
    {
      id: 2,
      nazwa: 'Fazowanie krawędzi',
      typ: 'obrobka',
      cena: 6.00,
      jednostka: 'mb',
      minPrice: 6.00
    },
    {
      id: 3,
      nazwa: 'Polerowanie krawędzi',
      typ: 'obrobka',
      cena: 9.00,
      jednostka: 'mb',
      minPrice: 9.00
    },
    {
      id: 8,
      nazwa: 'Grafika latex',
      typ: 'druk',
      cena: 75.00,
      jednostka: 'm2'
    },
    {
      id: 9,
      nazwa: 'Grawerowanie',
      typ: 'obrobka',
      cena: 100.00,
      jednostka: 'godz'
    }
  ];