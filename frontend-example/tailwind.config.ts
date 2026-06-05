import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3525cd',
          accent: '#4f46e5',
          light: '#c3c0ff',
        },
        ui: {
          bg: '#f9f9ff',
          border: '#c7c4d8',
          dark: '#151c27',
          medium: '#464555',
          muted: '#777587',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
