import React from "react";
import { Box } from "@mui/material";
import AddTaskForm from "./AddTaskForm";
import NestedTasks from "./NestedTasks";

const TaskLayout = ({ tasks }) => {
	// TODO: Wrap List Context
	const handleAddTask = (newTask) => {
		// TODO: Logic to add a new task
		console.log(newTask);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<AddTaskForm onAddTask={handleAddTask} />
			<NestedTasks tasks={tasks} />
		</Box>
	);
};

export default TaskLayout;
