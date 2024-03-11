// Sidebar.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";

import Lists from "./Lists";
import AddListDialog from "./AddListDialog";

export function ListSidebar({ lists, currentListId, onListSelect }) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Lists
				lists={lists}
				currentListId={currentListId}
				onListSelect={onListSelect}
				onAddButtonClick={handleDialogOpen}
			/>
			<AddListDialog open={dialogOpen} handleClose={handleDialogClose} />
		</Box>
	);
}
ListSidebar.propTypes = {
	lists: PropTypes.array.isRequired,
	currentListId: PropTypes.number,
	onListSelect: PropTypes.func.isRequired,
};

export default ListSidebar;
