/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'agri-dark':    '#0F1A14',
        'agri-surface': '#1A2820',
        'agri-border':  '#2A3D30',
        'agri-green':   '#2F8F5B',
        'agri-amber':   '#E4B363',
        'agri-red':     '#B33A3A',
        'agri-text':    '#EAEFEA',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"IBM Plex Sans"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'pulse-green':  'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGreen: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(47,143,91,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(47,143,91,0)' } },
      },
    },
  },
  plugins: [],
};
