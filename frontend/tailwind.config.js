module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pi-purple': {
          900: '#3D0866',
          800: '#4A0A7A',
          700: '#5B0C96',
          600: '#6B0FB9',
          500: '#7E2BC9',
          400: '#9B5DD6',
          300: '#B98DE3',
          200: '#D7BDF0',
          100: '#F0E5FA',
        },
        'pi-orange': {
          600: '#E69516',
          500: '#F5A623',
          400: '#F7B84D',
          300: '#F9CA77',
        },
        'pi-gray': {
          900: '#0F0F10',
          800: '#18181B',
          700: '#27272A',
          600: '#3F3F46',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7',
          100: '#F4F4F5',
        },
        // Retro Futurism Colors
        'retro-gold': '#D4AF37',
        'retro-copper': '#B87333',
        'retro-bronze': '#CD7F32',
        'retro-silver': '#C0C0C0',
        'neon-purple': '#B026FF',
        'neon-pink': '#FF10F0',
        'neon-cyan': '#00D9FF',
        'neon-green': '#39FF14',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Garamond', 'serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
