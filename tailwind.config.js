/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./*.{html,js}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f2f9ff',
					100: '#eff8ff',
					200: '#cfe4f2',
					300: '#b0d0e6',
					400: '#70a9cd',
					500: '#3082b5',
					600: '#2b749f',
					700: '#1d4f66',
					800: '#163c4c',
					900: '#102933',
					950: '#12283a',
				},
			},
		},
	},
	plugins: [],
};
