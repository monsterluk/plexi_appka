// tailwind.config.js

module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Możesz dodać własne kolory jeśli potrzebujesz
        },
        animation: {
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          glow: {
            'from': {
              'box-shadow': '0 0 10px -10px currentColor',
            },
            'to': {
              'box-shadow': '0 0 20px 10px currentColor',
            },
          },
        },
      },
    },
    plugins: [],
    safelist: [
      // Dodaj klasy dynamiczne, które używasz
      'ring-blue-500/50',
      'ring-red-500/50',
      'ring-amber-500/50',
      'ring-green-500/50',
      'ring-purple-500/50',
      'ring-indigo-500/50',
      'ring-pink-500/50',
      'ring-teal-500/50',
      'border-blue-500',
      'border-red-500',
      'border-amber-500',
      'bg-blue-500/10',
      'bg-red-500/10',
      'bg-amber-500/10',
      'hover:bg-blue-500/20',
      'hover:bg-red-500/20',
      'hover:bg-amber-500/20',
    ],
  };