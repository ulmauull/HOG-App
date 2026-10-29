/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
      },
      colors: {
        'surface-base': '#0B0E14',
        'surface-card': '#12161F',
        'surface-elevated': '#1A202C',
        'surface-container': '#1D2026',
        'surface-container-high': '#272A31',
        'primary-container': '#00FF66',
        'on-primary-fixed': '#002107',
        secondary: '#69D7DE',
        'status-available': '#00FF66',
        'status-in-use': '#78E5EC',
        'status-reserved': '#B993FF',
        'status-offline': '#4A5568',
      },
    },
  },
  plugins: [],
}

