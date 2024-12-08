/** @type {import('tailwindcss').Config} */
export default {
  // Define the content paths for tree-shaking unused styles in production
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
}

