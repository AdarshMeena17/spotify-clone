/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0B0C0E',
          raised: '#141518',
          panel: '#1B1C20',
          hover: '#232529',
          border: '#2A2C31',
        },
        ink: {
          DEFAULT: '#F3F4F2',
          dim: '#A6A9B1',
          faint: '#6C6F78',
        },
        moss: {
          DEFAULT: '#3ECF8E',
          dim: '#2C9E6C',
          bright: '#5CE8A8',
          wash: 'rgba(62, 207, 142, 0.12)',
        },
        signal: {
          danger: '#F2545B',
          warn: '#E8A83E',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 8px 24px -8px rgba(0,0,0,0.55)',
        player: '0 -8px 24px -12px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        xl2: '0.875rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'bar-bounce': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'bar-1': 'bar-bounce 1.1s ease-in-out infinite',
        'bar-2': 'bar-bounce 1.1s ease-in-out infinite 0.2s',
        'bar-3': 'bar-bounce 1.1s ease-in-out infinite 0.4s',
      },
    },
  },
  plugins: [],
};
