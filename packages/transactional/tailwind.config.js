/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./templates/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					primary: '#2563eb', // blue-600
					secondary: '#1d4ed8', // blue-700
				},
			},
		},
	},
};
