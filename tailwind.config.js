/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override indigo with brand teal so all existing indigo-* classes become brand
        indigo: {
          50:  '#edfcfb',
          100: '#d0f7f5',
          200: '#a3eeea',
          300: '#62dfda',
          400: '#2ccbc3',
          500: '#19bfb7',
          600: '#0d9990',
          700: '#0e7a73',
          800: '#0f5f5a',
          900: '#104e4a',
          950: '#082d2a',
        },
        // Brand dark background
        dark: '#1e2022',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
