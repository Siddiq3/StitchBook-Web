/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        charcoal: '#334155',
        midnight: '#123E9C',
        plum: '#6366F1',
        linen: '#F1F5F9',
        bone: '#F5F7FA',
        taupe: '#64748B',
        brass: '#1A56DB',
        saffron: '#6366F1',
        sage: '#16A34A',
        mist: '#EEF4FF',
        rosewood: '#B91C1C',
        clay: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, 0.08)',
        glow: '0 18px 46px rgba(26, 86, 219, 0.22)',
      },
    },
  },
  plugins: [],
};
