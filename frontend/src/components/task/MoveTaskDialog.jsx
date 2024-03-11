// Move task to another list
import React, { useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useLists } from "../../contexts/ListsContext";
import PropTypes from "prop-types";

const MoveTaskDialog = ({ taskId, onMoveTask }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const lists = useLists();
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMove = (targetListId) => {
		onMoveTask(taskId, targetListId);
		handleClose();
	};

	return (
		<>
			<IconButton edge="end" aria-label="move" onClick={handleClick}>
				<DriveFileMoveIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						style: {
							maxHeight: "50vh",
						},
					},
				}}
			>
				{lists.map((list) => (
					<MenuItem key={list.id} onClick={() => handleMove(list.id)}>
						{list.name}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

MoveTaskDialog.propTypes = {
	taskId: PropTypes.number.isRequired,
	onMoveTask: PropTypes.func.isRequired,
};

export default MoveTaskDialog;
