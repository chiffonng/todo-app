import React from "react";
import { Typography, Box } from "@mui/material";

const EmptyListPrompt = () => (
	<Box
		sx={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			height: "100%",
		}}
	>
		<Typography variant="h4">Welcome!</Typography>
		<Typography variant="body1">Start by creating a new list.</Typography>
	</Box>
);

export default EmptyListPrompt;
