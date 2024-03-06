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
			secondary: "#B8BABD", // Gray
		},
		primary: {
			main: "#3060BF", // Blue
		},
		secondary: {
			main: "#E65677", // Red
		},
		warning: {
			main: "#F6D54B", // Yellow
		},
		// You can also define other colors like error, info, success, etc.
	},
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            "Merriweather",
        ].join(','),
    },
});

export default theme;
