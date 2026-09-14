/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f3f5f8',
        foreground: '#0f172a',
        panel: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
        },
        primary: {
          DEFAULT: '#0f766e',
          hover: '#0d9488',
          glow: '#14b8a6',
          foreground: '#ffffff',
        },
        signal: {
          DEFAULT: '#059669',
          glow: '#34d399',
        },
        energy: {
          DEFAULT: '#c2410c',
          glow: '#ea580c',
        },
        muted: {
          DEFAULT: '#64748b',
          dark: '#475569',
        },
        border: 'rgba(15, 23, 42, 0.09)',
        input: 'rgba(15, 23, 42, 0.06)',
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
