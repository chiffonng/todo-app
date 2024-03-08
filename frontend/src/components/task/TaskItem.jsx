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
import TaskMenu from "./TaskMenuDialog";

function TaskItem({ task, index, onToggleSubtasks, subtasksVisible }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [text, setText] = useState(task.name);
	const [isCompleted, setIsCompleted] = useState(task.isCompleted);
	const open = Boolean(anchorEl);

	const handleToggle = () => {
		setIsCompleted(!isCompleted);
		// TODO: Implement task completion toggle functionality in your application state
		console.log(`Toggled task ${task.id}: ${!isCompleted}`);
	};

	const handleClickMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleEditTask = (event) => {
		setText(event.target.value);
		// TODO: Implement text update
	};

	// TODO: These handlers would trigger the functionality passed from the parent component
	const handleAddSubtask = () => console.log("Add subtask");
	const handleDeleteTask = () => console.log("Delete task");
	const handleMoveTask = () => console.log("Move task");

	// This handler will be invoked when the expand/collapse icon is clicked
	const handleToggleSubtasks = () => {
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
						checked={isCompleted}
						tabIndex={-1}
						disableRipple
						onChange={handleToggle}
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
						<IconButton onClick={handleToggleSubtasks}>
							{subtasksVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						</IconButton>
					)}
					<IconButton edge="end" aria-label="more" onClick={handleClickMenu}>
						<MoreVertIcon />
					</IconButton>
					<TaskMenu
						anchorEl={anchorEl}
						open={open}
						handleClose={handleCloseMenu}
						handleAddSubtask={handleAddSubtask}
						handleDeleteTask={handleDeleteTask}
						handleMoveTask={handleMoveTask}
						depth={0} // TODO: Replace with actual depth value if necessary
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
		subtasks: PropTypes.array, // You might have subtasks as part of your task object
	}).isRequired,
	index: PropTypes.number.isRequired,
	onToggleSubtasks: PropTypes.func, // Added prop for toggle subtasks
	subtasksVisible: PropTypes.bool, // Added prop to indicate if subtasks are visible
};

export default TaskItem;
