/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  safelist: ['hidden'], // 👈 ensures it's never purged
  theme: {
    extend: {},
  },
  plugins: [],
}
