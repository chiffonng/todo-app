import React from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";

const TaskActionsDialog = ({
	anchorEl,
	open,
	handleClose,
	handleAddSubtask,
	handleDeleteTask,
	handleMoveTask,
	depth,
}) => {
	const handleMenuAction = (action) => () => {
		handleClose();
		action();
	};
	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			slotProps={{
				paper: {
					style: {
						maxHeight: 48 * 4.5,
						width: "20ch",
					},
				},
			}}
		>
			<MenuItem onClick={handleMenuAction(handleAddSubtask)}>
				<ListItemIcon>
					<AddIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>Add subtask</ListItemText>
			</MenuItem>
			<MenuItem onClick={handleMenuAction(handleDeleteTask)}>
				<ListItemIcon>
					<DeleteOutlineIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText>Delete task</ListItemText>
			</MenuItem>
			{/* Conditionally rendering move task on the top-level task only */}
			{depth === 0 && (
				<MenuItem onClick={handleMenuAction(handleMoveTask)}>
					<ListItemIcon>
						<DriveFileMoveOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Move task</ListItemText>
				</MenuItem>
			)}
		</Menu>
	);
};

TaskActionsDialog.propTypes = {
	anchorEl: PropTypes.any,
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleAddSubtask: PropTypes.func.isRequired,
	handleDeleteTask: PropTypes.func.isRequired,
	handleMoveTask: PropTypes.func.isRequired,
	depth: PropTypes.number.isRequired,
};

export default TaskActionsDialog;
