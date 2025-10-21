/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ad-primary': '#6366f1',
        'ad-secondary': '#8b5cf6',
        'ad-accent': '#ec4899',
        'ad-success': '#10b981',
        'ad-warning': '#f59e0b',
        'ad-danger': '#ef4444',
      },
    },
  },
  plugins: [],
}
