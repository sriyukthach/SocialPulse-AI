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
        mono: {
          bg: '#050505',
          main: '#080808',
          surface: '#101010',
          card: '#141414',
          elevated: '#181818',
          border: '#252525',
          borderLight: '#2E2E2E',
          textPrimary: '#F5F5F5',
          textSecondary: '#B3B3B3',
          textMuted: '#737373',
          textSubtle: '#555555'
        }
      }
    },
  },
  plugins: [],
}
