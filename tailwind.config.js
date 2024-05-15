/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        messi: "url('/public/messi.jpg')",
        'messi-blur': "url('/public/messi_blur.jpg')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
