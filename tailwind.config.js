/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '4rem',
        lg: '6rem',
        xl: '8rem',
        '2xl': '10rem'
      }
    },
    extend: {}
  },
  plugins: []
}
