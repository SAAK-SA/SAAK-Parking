/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B2E59',
          green: '#16A34A',
        },
        surface: '#F8FAFC',
        border: '#E5E7EB',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
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
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 4px 16px 0 rgba(11,46,89,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 8px 24px 0 rgba(11,46,89,0.10)',
      },
    },
  },
  plugins: [],
};
