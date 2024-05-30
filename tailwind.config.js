/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        messi: "url('/messi.jpg')",
        'messi-blur': "url('/messi_blur.jpg')",
        'background-theme': "url('/background_img.jpg')",
        'green-soccer-field-theme': "url('/green_soccer_field.png')",
        'white-soccer-field-theme': "url('/white_soccer_field.png')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
