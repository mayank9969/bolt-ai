/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f4f6fb',
          100: '#e8ecf5',
          200: '#cdd5e8',
          300: '#a8b5d4',
          400: '#7d8fbd',
          500: '#5d6fa3',
          600: '#475687',
          700: '#3a476d',
          800: '#2e3853',
          900: '#1a2138',
          950: '#0d1124',
        },
        accent: {
          50: '#eafcff',
          100: '#c9f6ff',
          200: '#97edff',
          300: '#5ddcff',
          400: '#2cc4f5',
          500: '#0aa3d4',
          600: '#0083ae',
          700: '#006890',
          800: '#005574',
          900: '#00435c',
        },
        gold: {
          400: '#f5d061',
          500: '#e8b923',
          600: '#c99a0a',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
