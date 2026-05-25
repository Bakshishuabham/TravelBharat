/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8F0',
          100: '#FFECD9',
          400: '#FF9A4D',
          500: '#FF6B35',
          600: '#E55A24',
          700: '#C44A17',
        },
        india: {
          green: '#228B22',
          'green-light': '#2EAF2E',
        },
        navy: {
          900: '#0D1B2A',
          800: '#12263A',
          700: '#1A3550',
          600: '#234567',
        },
        cream: '#FFF8F0',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #1A3550 50%, #234567 100%)',
        'card-gradient': 'linear-gradient(to bottom, transparent 40%, rgba(13,27,42,0.95) 100%)',
      },
      keyframes: {
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};
