import React from "react";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Typography from "@mui/material/Typography";
import ListItem from "./ListItem";

import PropTypes from "prop-types";

export const Lists = ({ lists, onAddButtonClick }) => {
	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					p: 2,
				}}
			>
				<Typography variant="h6">Lists</Typography>
				<IconButton onClick={onAddButtonClick}>
					<AddCircleOutlineIcon />
				</IconButton>
			</Box>
			{lists.map((list) => (
				<ListItem key={list.id} name={list.name} count={list.tasks.length} />
			))}
		</Box>
	);
};

Lists.propTypes = {
	lists: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			tasks: PropTypes.array.isRequired,
		})
	).isRequired,
	onAddButtonClick: PropTypes.func.isRequired,
};

export default Lists;
