/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
				inter: ["Inter", "sans-serif"],
				geist: ["Geist", "sans-serif"],
				londrina: ["Londrina Shadow", "sans-serif"],
				rubik: ["Rubik Mono One", "monospace"],
			},
    },
  },
  plugins: [],
}

