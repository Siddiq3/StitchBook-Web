/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        muted: '#5F6673',
        border: '#E2E5EB',
        'brand-50': '#EEF3FF',
        charcoal: '#334155',
        midnight: '#1745B0',
        plum: '#6366F1',
        linen: '#EFF1F5',
        bone: '#F7F8FA',
        taupe: '#5F6673',
        brass: '#1A56DB',
        saffron: '#6366F1',
        sage: '#15803D',
        mist: '#EEF3FF',
        rosewood: '#B91C1C',
        clay: '#B91C1C',
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
