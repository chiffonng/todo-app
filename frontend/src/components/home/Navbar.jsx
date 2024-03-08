import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
	//TODO: const { isAuthenticated, logout } = useContext(AuthContext);
	// For testing purposes, we use local state to simulate authentication.
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Simulate a logout function
	const logout = () => {
		console.log("Logout clicked");
		setIsAuthenticated(false);
		// Here you would normally clear the auth tokens and update the context
	};

	return (
		<AppBar
			position="static"
			color="default"
			elevation={0}
			sx={{ flexGrow: 1 }}
		>
			<Toolbar>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					Just Do
				</Typography>
				{!isAuthenticated ? (
					<Box sx={{ "& > *": { ml: 2 } }}>
						{" "}
						{/* Apply margin between children */}
						<Button color="inherit" variant="outlined" href="/signup">
							Sign Up
						</Button>
						<Button color="primary" variant="contained" href="/login">
							Login
						</Button>
					</Box>
				) : (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Typography variant="subtitle1" sx={{ marginRight: 2 }}>
							{/* Display the user's name or username here */}
						</Typography>
						<Button color="inherit" onClick={logout}>
							Logout
						</Button>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
}
