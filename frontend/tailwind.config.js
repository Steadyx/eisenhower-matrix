/** @type {import('tailwindcss').Config} */
export default {
  // Define the content paths for tree-shaking unused styles in production
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      colors: { softWhite: "#e3e6e8" },
    },
  },
};
