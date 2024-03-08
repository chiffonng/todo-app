import React from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";

const TaskMenu = ({
	anchorEl,
	open,
	handleClose,
	handleAddSubtask,
	handleDeleteTask,
	handleMoveTask,
	depth,
}) => {
	const handleMenuClick = (action) => {
		handleClose(); // close the menu
		action(); // then perform the action
	};
	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			slotProps={{
				paper: {
					style: {
						maxHeight: "48px * 4.5",
						width: "20ch",
					},
				},
			}}
		>
			<MenuItem onClick={() => handleMenuClick(handleAddSubtask)}>
				<ListItemIcon>
					<AddIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>Add subtask</ListItemText>
			</MenuItem>
			<MenuItem onClick={() => handleMenuClick(handleDeleteTask)}>
				<ListItemIcon>
					<DeleteOutlineIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>Delete task</ListItemText>
			</MenuItem>
			{/* Conditionally render the Move task option based on depth */}
			{depth === 0 && (
				<MenuItem onClick={() => handleMenuClick(handleMoveTask)}>
					<ListItemIcon>
						<DriveFileMoveOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Move task </ListItemText>
				</MenuItem>
			)}
		</Menu>
	);
};

TaskMenu.propTypes = {
	anchorEl: PropTypes.any,
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleAddSubtask: PropTypes.func.isRequired,
	handleEditTask: PropTypes.func.isRequired,
	handleDeleteTask: PropTypes.func.isRequired,
	handleMoveTask: PropTypes.func.isRequired,
	depth: PropTypes.number.isRequired,
};

export default TaskMenu;
