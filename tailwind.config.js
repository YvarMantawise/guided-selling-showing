import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Berino Kleurenpalet
      colors: {
        berino: {
          forest: {
            dark: '#1B4332',
            DEFAULT: '#2D5A45',
          },
          sage: {
            DEFAULT: '#52796F',
            light: '#84A98C',
          },
          mint: '#CAD2C5',
          cream: '#F5F1EB',
          offwhite: '#FAFAF8',
          charcoal: '#2F2F2F',
          gray: '#6B6B6B',
        }
      },
      // Font families
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      // Font sizes met line-height
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '600' }],
        'h1': ['3rem', { lineHeight: '1.1', fontWeight: '600' }],
        'h2': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '500' }],
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      // Spacing voor secties
      spacing: {
        'section': '5rem',
        'section-lg': '7.5rem',
      },
      // Border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Shadows
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'button': '0 4px 14px rgba(27, 67, 50, 0.25)',
        'button-hover': '0 6px 20px rgba(27, 67, 50, 0.35)',
      },
      // Animaties
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Container sizes
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
      },
    },
  },
   plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
