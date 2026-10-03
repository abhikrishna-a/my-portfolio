/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // No `darkMode` key. The previous `darkMode: 'class'` was inert: the project
  // contains zero `dark:` variants and zero `.dark` selectors, so it could never
  // have produced a dark theme. Setting it only implied one existed.
  // Light is the single theme. If a dark theme is ever wanted, add it as
  // explicit tokens in src/index.css rather than by flipping a switch here.
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-dim": "var(--primary-dim)",
        "primary-hair": "var(--primary-hair)",
        accent: "var(--link-accent)",
        "accent-dim": "var(--accent-dim)",
        "accent-hair": "var(--accent-hair)",
        secondary: "var(--secondary)",
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--border)",
        amber: "var(--amber)",
      },
      fontFamily: {
        sans: ['Spectral', 'Georgia', 'serif'],
        display: ['Archivo', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
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
        scrollDot: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        streak: {
          from: { transform: 'translateX(-56px)' },
          to: { transform: 'translateX(168px)' },
        },
        // signalBlink used to be defined here as well as in index.css, with a
        // different mid value (0.3 here, 0.25 there). The hero blink is driven
        // by an inline style, which resolves to the index.css copy, so this one
        // was unused config carrying a latent disagreement.
      },
      animation: {
        revealUp: 'revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        revealDown: 'revealDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleUp: 'scaleUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        scrollDot: 'scrollDot 2s infinite ease-in-out',
        marquee: 'marquee 20s linear infinite',
        streak: 'streak 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
