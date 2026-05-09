/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#38a9f8',
          500: '#0e8de9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6e',
          950: '#082849',
        },
        navy: {
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        }
      },
      aspectRatio: {
        'poster': '1080 / 1350',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 59, 143, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'canvas': '0 0 0 1px rgba(0,0,0,0.05), 0 30px 60px -12px rgba(0,0,0,0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 20px 40px -10px rgba(0,0,0,0.08)',
        'focus-ring': '0 0 0 4px rgba(37,99,235,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
