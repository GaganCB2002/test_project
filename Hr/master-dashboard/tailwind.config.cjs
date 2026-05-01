/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // enable class strategy
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // blue
        secondary: '#8B5CF6', // purple
        success: '#14B8A6', // teal
      },
    },
  },
  plugins: [],
};
