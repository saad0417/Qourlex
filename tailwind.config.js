/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'primary-bg': '#030712',
        'secondary-bg': '#0F172A',
        'card-bg': '#1E293B',
        'card-hover': '#334155',
        'accent-primary': '#4F46E5',
        'accent-primary-hover': '#4338CA',
        'accent-secondary': '#7C3AED',
        'status-success': '#10B981',
        'status-danger': '#EF4444',
        'text-heading': '#FFFFFF',
        'text-body': '#E2E8F0',
        'text-muted': '#94A3B8',
        'text-link': '#818CF8',
        'border-card': '#1E293B',
        'border-divider': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Epic Pro', 'Clash Display', 'Syne', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['72px', { lineHeight: '80px', fontWeight: '800' }],
        'hero-mobile': ['48px', { lineHeight: '54px', fontWeight: '800' }],
        'section-headline': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'section-headline-mobile': ['32px', { lineHeight: '38px', fontWeight: '700' }],
        'section-sub': ['20px', { lineHeight: '28px', fontWeight: '400' }],
        'card-title': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'text-sm-custom': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      boxShadow: {
        'ios-glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 20px 50px -15px rgba(0, 0, 0, 0.7)',
        'ios-glass-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.3), 0 25px 60px -15px rgba(79, 70, 229, 0.35)',
        'ios-card': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 20px 0 rgba(255, 255, 255, 0.02), 0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at center, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
        'cta-linear': 'linear-gradient(180deg, #0F172A 0%, #030712 100%)',
        'ios-shine': 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(79, 70, 229, 0.12) 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
