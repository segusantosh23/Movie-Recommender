/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      colors: {
        'netflix': {
          'red': '#e50914',
          'red-hover': '#f40612',
          'black': '#141414',
          'dark-gray': '#181818',
          'gray': '#2f2f2f',
          'light-gray': '#564d4d',
          'white': '#ffffff',
          'text-gray': '#b3b3b3',
        }
      },
      fontFamily: {
        'netflix': ['Netflix Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
