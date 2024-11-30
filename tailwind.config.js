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
        primary: '#121212',
        text: '#EAEAEA',
        error: '#FF4D4D',
        accent: '#6A0DAD',
        'secondary-text': '#A1A1A1', 
        'highlight-text': '#E3C8FF',
        'secondary-accent': '#8A2BE2',
        'text-accent': '#B28DFF',
        border: '#333333',
      }
    }
  },
  plugins: [],
};