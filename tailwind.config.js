/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,vue}',
    './lib/**/*.{js,ts,vue}'
  ],
  purge: ['./index.html', './src/**/*.{js,ts,vue}', './lib/**/*.{js,ts,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
