/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        muted: '#697386',
        border: '#E7E2DA',
        'brand-50': '#EEF3FF',
        charcoal: '#344054',
        midnight: '#2247B3',
        plum: '#2F5BD3',
        linen: '#F5F0E8',
        bone: '#FBFAF7',
        taupe: '#7A746B',
        brass: '#2F5BD3',
        saffron: '#C8893B',
        sage: '#187A5A',
        mist: '#EEF3FF',
        rosewood: '#B42318',
        clay: '#B54708',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,32,51,.04), 0 14px 34px rgba(23,32,51,.07)',
        glow: '0 18px 50px rgba(47,91,211,.16)',
      },
    },
  },
  plugins: [],
};
