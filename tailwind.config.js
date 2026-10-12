/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald primary
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          teal: '#0d9488',
          mint: '#2dd4bf',
        },
        accent: {
          streak: '#ff7a00',
          flame: '#f97316',
          amber: '#f59e0b',
          gold: '#eab308',
          xp: '#8b5cf6',
          heart: '#ef4444',
          gem: '#3b82f6',
        },
        // 6 Vietnamese Tones semantic colors for foreign learners
        tone: {
          level: '#0ea5e9',    // Ngang (Level / Mid pitch - Sky Blue)
          falling: '#10b981',  // Huyền (Low falling pitch - Emerald Green)
          rising: '#f97316',   // Sắc (High rising pitch - Vibrant Orange)
          asking: '#8b5cf6',   // Hỏi (Dipping-rising pitch - Violet)
          tumbling: '#ec4899', // Ngã (High broken glottal pitch - Pink/Magenta)
          heavy: '#e11d48',    // Nặng (Low dropping glottal pitch - Crimson Dot)
        },
        surface: {
          ground: '#f8fafc',
          card: '#ffffff',
          subtle: '#f1f5f9',
          border: '#e2e8f0',
          'border-strong': '#cbd5e1',
          ink: '#0f172a',
          muted: '#64748b',
          faint: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Be Vietnam Pro"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        '3d-primary': '0 4px 0 #047857',
        '3d-primary-hover': '0 2px 0 #047857',
        '3d-accent': '0 4px 0 #c2410c',
        '3d-card': '0 3px 0 #cbd5e1',
        '3d-success': '0 4px 0 #15803d',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333333%)' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s ease-in-out',
        'marquee': 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
