/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*/index.html",
    "./*/**/index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    screens: {
      ph: '480px',
      sm: '500px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      fontFamily: {
        h: ['Poppins', 'sans-serif'],
        p: ['Roboto', 'sans-serif']
      },
      colors: {
        bg: '#EFD7FF',
        secondary: '#B28DFF',
        accent: '#ff4081',
        primary: '#6A0DAD',
        text: '#121212',
        error: '#FF4D4D',
        border: '#A1A1A1',
      }
    }
  },
  plugins: [],
};