/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        ticker: 'ticker 30s linear infinite',
        pause: 'ticker 30s linear infinite paused',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Move left by 50% to create seamless loop
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ["var(--font-hedvig)", "serif"], // <-- Use the custom var
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:first-of-type::after': {
              content: 'none',
            },
            'blockquote': {
              fontFamily: 'var(--font-nothing)',
            },
            // Improve overall line-height and spacing
            'p, li': {
              lineHeight: '1.7',
              marginBottom: '0.75rem',
            },
            'h1, h2, h3, h4': {
              lineHeight: '1.2',
              marginBottom: '1rem',
            },
            'h1': {
              marginBottom: '1.5rem',
            },
            'h2': {
              marginBottom: '1.25rem',
            },
            // Better blockquote styling
            'blockquote': {
              borderLeftWidth: '4px',
              borderLeftColor: 'rgba(255, 255, 255, 0.4)',
              paddingLeft: '1.5rem',
              fontStyle: 'italic',
              margin: '2rem 0',
            },
            // Improve list styling
            'ul, ol': {
              paddingLeft: '1.5rem',
            },
            'li': {
              marginBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
