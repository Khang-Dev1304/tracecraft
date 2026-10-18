/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sketch: ['"Caveat"', '"Architects Daughter"', 'cursive', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        sketch: {
          bg: '#fdfbf7',
          surface: '#f6f2e9',
          border: '#3c3836',
          text: '#282828',
          accent: '#b16286',
          primary: '#d65d0e',
          highlight: '#fabd2f',
          success: '#98971a',
          danger: '#cc241d',
          info: '#458588',
        },
        studio: {
          bg: '#090d16',
          surface: '#111827',
          card: '#1a2234',
          border: '#2a3449',
          text: '#f3f4f6',
          muted: '#9ca3af',
          accent: '#06b6d4',
          primary: '#6366f1',
          highlight: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          info: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
