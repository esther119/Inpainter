const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "rgb(255, 247, 145)",
        black: colors.black,
        white: colors.white,
        shade: "rgba(0, 0, 0, 0.45)",
        bgshade: "rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', 'cursive']
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
