/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': {
          light: '#3D365C',
          dark: '#221E36',
        },
        'secondary': {
          light: '#C68EFD',
          dark: '#8E65C7',
        },
        'accent': {
          light: '#E9A5F1',
          dark: '#B674C7',
        },
        'highlight': {
          light: '#FED2E2',
          dark: '#D395B4',
        },
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      screens: {
        'lsm': '350px',
        'esm': '400px',
        'em': '480px',
        'sm': '640px',
        'md': '768px',
        'emd': '999px',
        'lg': '1024px',
        'xlg': '1150px',
        'xl': '1280px',
        'mxl': '1300px',
        '1xl': '1440px',
        '2xl': '1530px',
        '3xl': '1832px',
        '4xl': '1920px',
      },
    },
  },
  plugins: [],
}