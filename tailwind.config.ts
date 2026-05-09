/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:'#FDF8F0', 100:'#FAEBD7', 200:'#F5D5A3', 300:'#EFB86A',
          400:'#E89A3C', 500:'#C97B2E', 600:'#A05E1F', 700:'#7A4316',
          800:'#572E0E', 900:'#3A1C08',
        },
      },
      boxShadow: {
        card:'var(--shadow-card)',
        'card-hover':'var(--shadow-card-hover)',
        modal:'var(--shadow-modal)',
        nav:'0 1px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
