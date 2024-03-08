import React from "react";
import { Typography, Button, Container } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFoundPage = () => {
	return (
		<Container
			component="main"
			maxWidth="md"
			sx={{
				mt: 8,
				mb: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<SentimentDissatisfiedIcon sx={{ fontSize: 80, mb: 2 }} />
			<Typography variant="h4" gutterBottom>
				404 - Page Not Found
			</Typography>
			<Typography variant="subtitle1" sx={{ mb: 2 }}>
				The page you are looking for might have been removed, had its name
				changed, or is temporarily unavailable.
			</Typography>
			<Button variant="contained" color="primary" href="/">
				Go to the Home Page
			</Button>
		</Container>
	);
};

export default NotFoundPage;
