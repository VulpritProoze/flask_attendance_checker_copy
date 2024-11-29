/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*"],
  theme: {
    extend: {
      fontFamily: {
        'alte-regular': ['"Alte Haas Grotesk Regular"', "sans-serif"],
        'alte-bold': ['"Alte Haas Grotesk Bold"', "sans-serif"],
        'logam': ['"Logam Regular"', "sans-serif"]
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
    })
  ],
}

