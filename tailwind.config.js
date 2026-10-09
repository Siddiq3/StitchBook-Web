/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        muted: '#475467',
        border: '#E4E9F0',
        'brand-50': '#EAF4FF',
        charcoal: '#344054',
        midnight: '#0066CC',
        plum: '#7D5B78',
        linen: '#EEF2F6',
        bone: '#F4F7FB',
        taupe: '#667085',
        // 'brass' is the legacy name of the brand accent; it is azure now, matching the app
        brass: '#007FFF',
        brand: '#007FFF',
        danger: '#B4233B',
        success: '#147A48',
        saffron: '#B7791F',
        sage: '#147A48',
        mist: '#EAF4FF',
        rosewood: '#B4233B',
        clay: '#B4233B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // One family across the site; no display serif
        serif: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(29,59,102,.05), 0 8px 24px rgba(29,59,102,.06)',
        glow: '0 16px 40px rgba(29,59,102,.10)',
      },
    },
  },
  plugins: [],
};
