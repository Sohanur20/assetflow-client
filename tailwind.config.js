import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf8', 100: '#d7f2ee', 200: '#b2e4de', 300: '#80cfc7',
          400: '#4db3ab', 500: '#31978f', 600: '#227a75', 700: '#1e625e',
          800: '#1b4f4c', 900: '#1a423f', 950: '#0a2422',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        assetflow: {
          primary: '#0f766e', secondary: '#134e4a', accent: '#2dd4bf',
          neutral: '#1e293b', 'base-100': '#ffffff', 'base-200': '#f1f5f9',
          'base-300': '#e2e8f0', info: '#0284c7', success: '#16a34a',
          warning: '#d97706', error: '#dc2626',
        },
      },
    ],
  },
};
