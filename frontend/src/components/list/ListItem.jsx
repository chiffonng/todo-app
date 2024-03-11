import React from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: -3,
		top: 13,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}));

/**
 *
 * @param {string} name - The name of the task list
 * @param {number} count - The number of tasks in the list
 * @returns {JSX.Element} - A task list component
 */

export default function ListItem({ name, count }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
			<Typography component="div" variant="h6">
				{name}
			</Typography>
			<StyledBadge badgeContent={count} color="primary" />
		</Box>
	);
}
ListItem.propTypes = {
	name: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
};
