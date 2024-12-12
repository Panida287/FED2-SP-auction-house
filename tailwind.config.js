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
        secondary: '#A1A1A1',
        accent: '#ff4081',
        primary: '#6A0DAD',
        text: '#EAEAEA',
        secondText: '#A1A1A1',
        error: '#FF4D4D',
      },
      backgroundImage: {
        'gradient-mask': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 29.53%, rgba(0, 0, 0, 1) 76%, rgba(0, 0, 0, 0) 100%)',
        'card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.10) 100%)'
      },
    }
  },
  plugins: [],
};