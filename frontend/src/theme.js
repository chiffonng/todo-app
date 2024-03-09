import { createTheme } from "@mui/material/styles";

// Mimic Things 3 colors

const theme = createTheme({
	palette: {
		type: "light",
		background: {
			default: "#F5F6F8", // Light Gray
			paper: "#FAFBFD", // White
		},
		text: {
			primary: "#2C323A", // Black
			secondary: "#B3B4B5", // Gray
		},
		primary: {
			main: "#3060BF", // Blue
			light: "#6C9AED", // Light Blue
			dark: "#134A9A", // Dark Blue
		},
		secondary: {
			main: "#F94776", // Red
			light: "#F18CAB", // Light Red
			dark: "#B72C4D", // Dark Red
		},
		warning: {
			main: "#F6D54B", // Yellow
			light: "#F6D54B", // Yellow
			dark: "#F6D54B", // Yellow
		},
		error: {
			main: "#FA1855",
		},
		info: {
			main: "#29B6F6", // Blue
		},
		success: {
			main: "#4CAF50", // Green
		},
	},
	typography: {
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Merriweather",
		].join(","),
	},
});

export default theme;
