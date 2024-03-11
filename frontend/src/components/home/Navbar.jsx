import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { ROUTES } from "../../utils/constants";

export default function Navbar(currentUser, logout) {
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
				{!currentUser ? (
					<Box sx={{ "& > *": { ml: 6 } }}>
						{/* Apply margin between children */}
						<Button color="inherit" variant="outlined" href={ROUTES.REGISTER}>
							Register
						</Button>
						<Button color="primary" variant="contained" href={ROUTES.LOGIN}>
							Login
						</Button>
					</Box>
				) : (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Typography variant="subtitle1" sx={{ marginRight: 2 }}>
							{currentUser.username}
						</Typography>
						<Button color="primary" variant="contained" onClick={logout}>
							Logout
						</Button>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
}
