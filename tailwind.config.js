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
        "primary-dim": "rgba(230,126,34,0.45)",
        "primary-hair": "rgba(230,126,34,0.28)",
        accent: "var(--accent)",
        "accent-dim": "rgba(56,189,248,0.45)",
        "accent-hair": "rgba(56,189,248,0.28)",
        secondary: "var(--secondary)",
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--border)",
        amber: "var(--amber)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
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
        cornerFlick: {
          '0%, 97%': { opacity: '0.85' },
          '97.5%': { opacity: '0.28' },
          '98%': { opacity: '0.85' },
          '98.6%': { opacity: '0.45' },
          '99%, 100%': { opacity: '0.85' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(230,126,34,0.30)' },
          '50%': { boxShadow: '0 0 20px rgba(230,126,34,0.50)' },
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
        introCard: {
          '0%': { opacity: '0', transform: 'scale(1.06)', filter: 'blur(8px)' },
          '25%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'scale(0.99)', filter: 'blur(0)' },
        },
        introReveal: {
          '0%': { opacity: '0', transform: 'scale(1.06)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        grainShift: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-2%, -3%)' },
          '100%': { transform: 'translate(1%, 2%)' },
        },
        streak: {
          from: { transform: 'translateX(-56px)' },
          to: { transform: 'translateX(168px)' },
        },
        comet: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(-100%) translateY(0)', opacity: '0' },
          '5%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateX(200vw) translateY(40vh)', opacity: '0' },
        },
        signalBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        revealUp: 'revealUp 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
        revealDown: 'revealDown 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleUp: 'scaleUp 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
        cornerFlick: 'cornerFlick 6s step-end infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
        scrollDot: 'scrollDot 2s infinite ease-in-out',
        marquee: 'marquee 20s linear infinite',
        introCard: 'introCard 5.2s ease forwards',
        introReveal: 'introReveal 4.2s ease-out forwards',
        grainShift: 'grainShift 0.4s steps(2) infinite',
        streak: 'streak 1.4s linear infinite',
        comet: 'comet 25s linear infinite',
        shootingStar: 'shootingStar 3s linear infinite',
        signalBlink: 'signalBlink 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
