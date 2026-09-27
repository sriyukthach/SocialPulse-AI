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
        brand: {
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1E293B',
          border: '#334155',
          accent: '#38BDF8',
          pink: '#F472B6',
          pinkLight: '#FDF2F8'
        }
      }
    },
  },
  plugins: [],
}
