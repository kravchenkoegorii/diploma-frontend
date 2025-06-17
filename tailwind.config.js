/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customGray: 'rgba(80, 80, 80, 0.32)',
        'white-3': '#FFFFFF08',
        'white-6': '#FFFFFF0F',
        'white-8': '#FFFFFF14',
      },
      rotate: {
        20: '20deg',
      },
      fontFamily: {
        radio: ['PP Radio Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        'min-2000px': { raw: '(min-width: 2000px)' },
        'max-1400px': { raw: '(max-width: 1399px)' },
        'min-1400px': { raw: '(min-width: 1400px)' },
        'min-1600px': { raw: '(min-width: 1600px)' },
        'min-1800px': { raw: '(min-width: 1800px)' },
        'max-1300px': { raw: '(max-width: 1299px)' },
        'max-1200px': { raw: '(max-width: 1199px)' },
        'min-1200px': { raw: '(min-width: 1200px)' },
        'max-992px': { raw: '(max-width: 992px)' },
        'min-992px': { raw: '(min-width: 993px)' },
        'max-374px': { raw: '(max-width: 374px)' },
        'max-height-730px': { raw: '(max-height: 730px)' },
        tablet: { raw: '(min-width: 992px) and (max-width: 1399px)' },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
