/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#0f2744',
          700: '#1e3a5f',
          600: '#2c5282',
        },
        queue: {
          low: '#10b981', // green
          moderate: '#f59e0b', // amber
          high: '#ef4444', // red
          unknown: '#6b7280', // grey
        }
      }
    },
  },
  plugins: [],
}

