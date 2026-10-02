/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#152238',
        muted: '#667085',
        border: '#E0E6EF',
        'brand-50': '#EDF3FF',
        charcoal: '#334155',
        midnight: '#0649BD',
        plum: '#0649BD',
        linen: '#F0F4FA',
        bone: '#FAFBFE',
        taupe: '#667085',
        brass: '#085CE8',
        saffron: '#0649BD',
        sage: '#085CE8',
        mist: '#EDF3FF',
        rosewood: '#085CE8',
        clay: '#085CE8',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'none',
        glow: 'none',
      },
    },
  },
  plugins: [],
};
