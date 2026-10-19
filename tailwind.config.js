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
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        viz: {
          bg: '#fcfcfc',
          card: '#ffffff',
          border: '#e2e8f0',
          darkBg: '#090d16',
          darkCard: '#111827',
          darkBorder: '#1f293d',
          blue: {
            fill: '#e0f2fe',
            border: '#0284c7',
            text: '#0369a1',
          },
          amber: {
            fill: '#fef3c7',
            border: '#d97706',
            text: '#b45309',
          },
          emerald: {
            fill: '#dcfce7',
            border: '#16a34a',
            text: '#15803d',
          },
          rose: {
            fill: '#fee2e2',
            border: '#dc2626',
            text: '#b91c1c',
          },
          purple: {
            fill: '#f3e8ff',
            border: '#9333ea',
            text: '#7e22ce',
          },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'dock': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
