import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1020',
          900: '#111A33',
          800: '#182544',
        },
        sand: {
          50: '#FFF8F1',
          100: '#FFF0DF',
          200: '#F8DDB9',
          400: '#D4A373',
        },
        rose: {
          300: '#F2A3A0',
          500: '#D46A6A',
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(11, 16, 32, 0.16)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(248, 221, 185, 0.16), transparent 36%), linear-gradient(180deg, rgba(17, 26, 51, 0.98), rgba(11, 16, 32, 1))',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
