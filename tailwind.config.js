/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'border': colors.gray[400],
      }
    },
    fontFamily: {
      'mono': ['Jetbrains\\ Mono']
    }
  },
  plugins: [require('tailwind-scrollbar')],
}

