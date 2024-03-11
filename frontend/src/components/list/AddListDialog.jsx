import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useLists } from "../../contexts/ListContext";

function AddListDialog({ open, handleClose }) {
	const { createList } = useLists();
	const [listName, setListName] = useState("");

	const handleListNameChange = (event) => {
		setListName(event.target.value);
	};

	const handleAddList = () => {
		createList(listName);
		setListName(""); // Reset the input field
		handleClose(); // Close the dialog
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Add New List</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To create a new list, please enter its name below.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="List Name"
					type="text"
					fullWidth
					variant="outlined"
					value={listName}
					onChange={handleListNameChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleAddList}>Add</Button>
			</DialogActions>
		</Dialog>
	);
}
AddListDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
};

export default AddListDialog;
