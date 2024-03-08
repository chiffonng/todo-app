import React, { useState } from "react";
import { TextField, Box, IconButton, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import PropTypes from "prop-types";

export const AddTaskForm = ({ onAddTask }) => {
	const [task, setTask] = useState("");
	const [isEditable, setIsEditable] = useState(false);

	const handleAddClick = () => {
		setIsEditable(true);
	};

	const handleAddTask = (event) => {
		if (event.key === "Enter" && task.trim() !== "") {
			onAddTask(task);
			setTask("");
			setIsEditable(false);
		}
	};

	const handleBlur = () => {
		setIsEditable(false);
		setTask(""); // Clear the task if we don't want to keep the text when the field blurs
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				padding: 1,
				backgroundColor: "default",
			}}
		>
			{isEditable ? (
				<TextField
					fullWidth
					variant="standard"
					placeholder="Add new task"
					value={task}
					onChange={(e) => setTask(e.target.value)}
					onKeyDown={handleAddTask}
					onBlur={handleBlur}
					autoFocus
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<AddCircleOutlineIcon />
							</InputAdornment>
						),
					}}
				/>
			) : (
				<IconButton onClick={handleAddClick} edge="start" size="large">
					<AddCircleOutlineIcon />
					<Box
						component="span"
						sx={{ pl: 1, cursor: "text" }}
						onClick={handleAddClick}
					>
						Add new task
					</Box>
				</IconButton>
			)}
		</Box>
	);
};

AddTaskForm.propTypes = {
	onAddTask: PropTypes.func.isRequired,
};

export default AddTaskForm;
