import React from "react";
import { Box } from "@mui/material";
import ListName from "../list/ListName";
import AddTaskForm from "./AddTaskForm";
import TaskHierarchy from "./TaskHierarchy";

import PropTypes from "prop-types";

const TaskLayout = ({ currentListId }) => {
	const { currentListId, fetchListById } = useLists();

	const handleAddTask = (newTask) => {
		createTask(newTask);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<ListName name={currentList?.name} />
			<AddTaskForm onAddTask={handleAddTask} />
			<TaskHierarchy tasks={tasks} />
		</Box>
	);
};

TaskLayout.propTypes = {
	currentListId: PropTypes.number.isRequired,
};

export default TaskLayout;
