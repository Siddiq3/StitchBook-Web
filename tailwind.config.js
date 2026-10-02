/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17212B',
        muted: '#65717D',
        border: '#E4E0D8',
        'brand-50': '#F6ECE6',
        charcoal: '#344252',
        midnight: '#233A57',
        plum: '#7D5B78',
        linen: '#F1EFEA',
        bone: '#F8F7F4',
        taupe: '#77746E',
        brass: '#B55E3A',
        saffron: '#B7791F',
        sage: '#2F7D68',
        mist: '#F6ECE6',
        rosewood: '#B64B4B',
        clay: '#B64B4B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,33,43,.04), 0 8px 24px rgba(23,33,43,.045)',
        glow: '0 16px 40px rgba(23,33,43,.08)',
      },
    },
  },
  plugins: [],
};
