/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        95: "95%",
        98: "98%",
      },
      screens: {
        xl: "1030px", // Custom breakpoint for 1030px
        "2xl": "1430px", // Custom breakpoint for 1430px
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: ["class", '[data-theme="dark"]'],
};
