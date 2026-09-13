/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0c0f17',
        foreground: '#f8fafc',
        panel: {
          DEFAULT: '#131824',
          hover: '#181f30',
        },
        primary: {
          DEFAULT: '#38bdf8',
          hover: '#0284c7',
          glow: '#7dd3fc',
          foreground: '#082f49',
        },
        signal: {
          DEFAULT: '#34d399',
          glow: '#6ee7b7',
        },
        energy: {
          DEFAULT: '#f59e0b',
          glow: '#fbbf24',
        },
        muted: {
          DEFAULT: '#94a3b8',
          dark: '#64748b',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-accent)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'drift': 'drift 18s ease-in-out infinite alternate',
        'spin-slow': 'spin 40s linear infinite',
        'spin-slow-reverse': 'spin-reverse 50s linear infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-node': 'pulse-node 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer-text': 'shimmer 6s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-node': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
