/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-header': '#517da2',
        'tg-input-bg': '#ffffff',
        'tg-outgoing': '#eeffde',
        'tg-incoming': '#ffffff',
        'tg-text': '#000000',
        'tg-text-secondary': '#6c7883',
        'tg-time': '#5fb452',
        'tg-send-btn': '#52a4dc',
      },
    },
  },
  plugins: [],
}