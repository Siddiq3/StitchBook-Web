/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2933',
        charcoal: '#2f3a44',
        midnight: '#17212b',
        plum: '#51435b',
        linen: '#f6f1e8',
        bone: '#fffdf8',
        taupe: '#7b7168',
        brass: '#b8843f',
        saffron: '#d9a84f',
        sage: '#6f8774',
        mist: '#e9f0ed',
        rosewood: '#8d5f64',
        clay: '#a9644e',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(31, 41, 51, 0.10)',
        glow: '0 18px 45px rgba(184, 132, 63, 0.18)',
      },
    },
  },
  plugins: [],
};
