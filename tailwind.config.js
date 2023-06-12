const primaryTheme = {
	h: 304.857143,
	s: 63.666667,
	l: 15.588235
};
const secondaryTheme = {
	h: 250.857143,
	s: 63.666667,
	l: 50.588235
};

const weights = {
	500: 11.9,
	530: 6.7,
	560: 2.9,
	600: 0.0,
	630: -2.6,
	645: -3.7,
	660: -5.9,
	700: -8.1,
	730: -9.6,
	760: -11.4,
	800: -13.3,
	830: -15.7,
	860: -18.1,
	900: -19.8
};

const primaryValues = Object.entries(weights).reduce((acc, [key, value]) => {
	acc[key] = `hsl(${primaryTheme.h}, ${primaryTheme.s}%, ${Math.max(0, primaryTheme.l + value)}%)`;
	return acc;
}, {});

const secondaryValues = Object.entries(weights).reduce((acc, [key, value]) => {
	acc[key] = `hsl(${secondaryTheme.h}, ${secondaryTheme.s}%, ${Math.max(
		0,
		secondaryTheme.l + value
	)}%)`;
	return acc;
}, {});

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: primaryValues,
				secondary: secondaryValues
			}
		}
	},
	plugins: []
};
