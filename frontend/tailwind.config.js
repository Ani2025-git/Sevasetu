/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Digital India Inspired Palette
        navy: {
          DEFAULT: '#173B72',
          50: '#f0f4f9',
          100: '#d9e2f0',
          200: '#b8c9e3',
          300: '#8da9d2',
          400: '#5c84be',
          500: '#3a66a7',
          600: '#274e8c',
          700: '#1d3e72',
          800: '#173B72', // Primary Navy Blue
          900: '#122e5a',
          950: '#0b1c37',
        },
        digital: {
          DEFAULT: '#2878C8',
          50: '#eff6fc',
          100: '#dbebf9',
          200: '#bdddf5',
          300: '#8ec5ee',
          400: '#58a7e3',
          500: '#2878C8', // Digital Blue
          600: '#2166af',
          700: '#1b528f',
          800: '#184474',
          900: '#183a60',
        },
        saffron: {
          DEFAULT: '#F39A32',
          50: '#fef8f0',
          100: '#fdeddb',
          200: '#fbd7b5',
          300: '#f7bc86',
          400: '#f4a156',
          500: '#F39A32', // Saffron Accent
          600: '#de7a20',
          700: '#b85e19',
          800: '#934a1a',
          900: '#773e19',
        },
        indiaGreen: {
          DEFAULT: '#16865B',
          50: '#edf8f3',
          100: '#d4efe1',
          200: '#aee0c8',
          300: '#7dcaba',
          400: '#4daea2',
          500: '#16865B', // Green Accent
          600: '#106f4b',
          700: '#0f583e',
          800: '#104733',
          900: '#0f3a2b',
        },
        surface: '#F5F7FA', // Light Background
        queue: {
          low: '#16865B',
          moderate: '#F39A32',
          high: '#E53E3E',
          unknown: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
