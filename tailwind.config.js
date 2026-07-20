/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // From the SAAK International logo
          navy: '#14396B',
          'navy-dark': '#0E2A52',
          'navy-light': '#2E5A9E',
          green: '#12A150',
          'green-dark': '#0C7C3D',
          'green-light': '#3FC77A',
          sky: '#3B82F6',
        },
        surface: '#F6F8FC',
        'surface-2': '#EEF2F9',
        border: '#E4E9F2',
        text: {
          primary: '#132238',
          secondary: '#5B6B85',
          muted: '#94A3B8',
        },
        status: {
          available: '#22C55E',
          occupied: '#EF4444',
          reserved: '#3B82F6',
          visitor: '#F97316',
          disabled: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Tajawal', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '26px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,57,107,0.04), 0 6px 20px rgba(20,57,107,0.06)',
        card: '0 2px 4px rgba(20,57,107,0.04), 0 12px 32px rgba(20,57,107,0.08)',
        'card-hover': '0 8px 20px rgba(20,57,107,0.10), 0 24px 48px rgba(20,57,107,0.14)',
        glow: '0 0 0 1px rgba(18,161,80,0.2), 0 12px 40px rgba(18,161,80,0.18)',
        'glow-blue': '0 0 0 1px rgba(20,57,107,0.15), 0 12px 40px rgba(20,57,107,0.16)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(24px,-30px) scale(1.08)' },
          '66%': { transform: 'translate(-18px,18px) scale(0.94)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'gradient-shift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.7s ease both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
