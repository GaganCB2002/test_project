/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        luxury: {
          black: '#020617',
          graphite: '#0f172a',
          silver: '#e2e8f0',
          blue: '#0066b1',
          accent: '#3b82f6',
        },
        brand: '#0066b1',
      },
      boxShadow: {
        premium: '0 30px 100px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
}
