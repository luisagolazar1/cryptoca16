/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          dark: '#0a0e27',
          darkest: '#050814',
        },
      },
    },
  },
  plugins: [],
};
