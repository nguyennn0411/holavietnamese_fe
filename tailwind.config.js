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
          50: '#FFF7E8',
          100: '#FFF0DC',
          200: '#FDE1B3',
          300: '#F5B942', // Brand Yellow
          400: '#F59E0B', // Warm Orange
          500: '#F97316', // Primary Orange
          600: '#EA580C',
          700: '#C2410C', // Orange Hover
          800: '#9A3412',
          900: '#7C2D12',
          yellow: '#F5B942',
          orange: '#F97316',
          warm: '#F59E0B',
          hover: '#C2410C',
          red: '#DA251D',
          'red-light': '#FFF0EE',
          teal: '#0d9488',
          mint: '#2dd4bf',
        },
        accent: {
          streak: '#ff7a00',
          flame: '#f97316',
          amber: '#f59e0b',
          gold: '#f5b942',
          xp: '#8b5cf6',
          heart: '#ef4444',
          gem: '#3b82f6',
          red: '#da251d',
          green: '#22a06b',
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
          ground: '#FFFCF7',
          card: '#FFFFFF',
          subtle: '#FFF7E8',
          peach: '#FFF0DC',
          neutral: '#F8FAFC',
          border: '#E8E5DF',
          'border-strong': '#CBD5E1',
          ink: '#253044',
          muted: '#64748B',
          faint: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Be Vietnam Pro"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(37, 48, 68, 0.05), 0 2px 6px -2px rgba(37, 48, 68, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(37, 48, 68, 0.08), 0 4px 10px -2px rgba(37, 48, 68, 0.04)',
        '3d-primary': '0 4px 0 #C2410C',
        '3d-primary-hover': '0 2px 0 #C2410C',
        '3d-accent': '0 4px 0 #C2410C',
        '3d-card': '0 3px 0 #E8E5DF',
        '3d-success': '0 4px 0 #22A06B',
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
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s ease-in-out',
        'marquee': 'marquee 22s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
