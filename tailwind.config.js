/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", '[data-mode="dark"]'],
	content: ["./src/react-app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				dark: "#2A303C",
				"dark-hover": "#313641",
				"dark-text": "#FFFFFF",
				"dark-purple": "#661AE6",
				"dark-pink": "#D926AA",
				"dark-aqua": "#1FB2A5",
				"dark-black": "#191D24",
			},
		},
	},
	plugins: [],
};
