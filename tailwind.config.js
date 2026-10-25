/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        drift: {
          '0%': { transform: 'scale(1.04) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.12) translate3d(-1.5%, -1%, 0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translate3d(-50%, 12px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(-50%, 0, 0)' },
        },
      },
      animation: {
        drift: 'drift 45s ease-in-out infinite alternate',
        ripple: 'ripple 700ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        toastIn: 'toastIn 300ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
