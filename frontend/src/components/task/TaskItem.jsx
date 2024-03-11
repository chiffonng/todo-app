import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import TaskActionsDialog from "./TaskActionsDialog";

function TaskItem({
	task,
	index,
	onToggleSubtasks,
	subtasksVisible,
	onEditTask,
	onToggleTaskCompletion,
	onAddSubtask,
	onDeleteTask,
	onMoveTask,
}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [text, setText] = useState(task.name);
	const open = Boolean(anchorEl);

	const handleToggleStatus = () => {
		onToggleTaskCompletion(task.id); // Updated to use a passed function
	};

	const handleClickMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleEditTask = (event) => {
		setText(event.target.value);
		onEditTask(task.id, event.target.value);
	};

	// Handlers will now invoke the functions passed from the parent component
	const handleDeleteTask = () => {
		onDeleteTask(task.id); //
	};

	const handleAddSubtask = () => {
		onAddSubtask(task.id);
	};

	const handleMoveTask = () => {
		onMoveTask(task.id);
	};

	// This handler will be invoked when the expand/collapse icon is clicked
	const handleToggleSubtasksClick = () => {
		onToggleSubtasks(task.id);
	};

	return (
		<Draggable draggableId={task.id.toString()} index={index}>
			{(provided) => (
				<ListItem
					component="li"
					{...provided.draggableProps}
					ref={provided.innerRef}
					disablePadding
				>
					<ListItemIcon {...provided.dragHandleProps}>
						<DragIndicatorIcon />
					</ListItemIcon>
					<Checkbox
						edge="start"
						checked={task.isCompleted}
						tabIndex={-1}
						disableRipple
						onChange={handleToggleStatus}
					/>
					<TextField
						fullWidth
						variant="standard"
						value={text}
						onChange={handleEditTask}
						InputProps={{
							disableUnderline: true,
						}}
					/>
					{task.subtasks && task.subtasks.length > 0 && (
						<IconButton onClick={handleToggleSubtasksClick}>
							{subtasksVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						</IconButton>
					)}
					<IconButton edge="end" aria-label="more" onClick={handleClickMenu}>
						<MoreVertIcon />
					</IconButton>
					<TaskActionsDialog
						anchorEl={anchorEl}
						open={open}
						handleClose={handleCloseMenu}
						handleAddSubtask={handleAddSubtask}
						handleDeleteTask={handleDeleteTask}
						handleMoveTask={handleMoveTask}
						depth={task.depth}
					/>
				</ListItem>
			)}
		</Draggable>
	);
}

TaskItem.propTypes = {
	task: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		name: PropTypes.string.isRequired,
		isCompleted: PropTypes.bool.isRequired,
		depth: PropTypes.number.isRequired,
		subtasks: PropTypes.array,
	}).isRequired,
	index: PropTypes.number.isRequired,
	onToggleSubtasks: PropTypes.func.isRequired,
	subtasksVisible: PropTypes.bool,
	onEditTask: PropTypes.func.isRequired,
	onToggleTaskCompletion: PropTypes.func.isRequired,
	onAddSubtask: PropTypes.func.isRequired,
	onDeleteTask: PropTypes.func.isRequired,
	onMoveTask: PropTypes.func.isRequired,
};

export default TaskItem;
