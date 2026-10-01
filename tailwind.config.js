/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101014',
        muted: '#5B5B66',
        border: '#E6E6EA',
        'brand-50': '#FEF1EA',
        charcoal: '#334155',
        midnight: '#9A3412',
        plum: '#9A3412',
        linen: '#EEEEF1',
        bone: '#F4F4F6',
        taupe: '#5B5B66',
        brass: '#C2410C',
        saffron: '#9A3412',
        sage: '#15803D',
        mist: '#FEF1EA',
        rosewood: '#BE123C',
        clay: '#BE123C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'none',
        glow: 'none',
      },
    },
  },
  plugins: [],
};
