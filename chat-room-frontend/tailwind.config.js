/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#0074D9',
        secondary: '#111111',
        title: {
          600: '#A3A3A3',
          900: '#666666',

        },
        black: '#111111',
        gray: {
          100: '#F8F8F8',
          200: '#EAEAEA',
          300: '#D2D2D2',
          400: '#A6A6A6',
          500: '#7F7F7F',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#171717',
        },
      },
    },
  },
  plugins: [],
}

