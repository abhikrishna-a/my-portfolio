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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        revealUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        revealDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        revealUp: 'revealUp 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
        revealDown: 'revealDown 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleUp: 'scaleUp 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
      },
    },
  },
  plugins: [],
}
