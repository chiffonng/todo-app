import React, { useState } from "react";
import List from "@mui/material/List";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Collapse from "@mui/material/Collapse";
import TaskItem from "./TaskItem";

import PropTypes from "prop-types";

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const TaskHierarchy = ({ tasks }) => {
	const [currentTasks, setCurrentTasks] = useState(tasks);
	const [open, setOpen] = useState({});

	const handleToggleSubtasks = (id) => {
		setOpen((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		// Only perform the action if the item is moved within the list
		if (
			source.droppableId === destination.droppableId &&
			source.index !== destination.index
		) {
			// Reorder the tasks
			const newTasks = reorder(currentTasks, source.index, destination.index);
			setCurrentTasks(newTasks);
		}
	};

	const renderTaskItems = (items, depth = 0) => {
		return items.map((task, index) => (
			<Draggable key={task.id} draggableId={task.id.toString()} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						<TaskItem
							task={task}
							index={index}
							onToggleSubtasks={handleToggleSubtasks}
							subtasksVisible={!!open[task.id]}
						/>
						{task.subtasks && (
							<Collapse in={open[task.id]} timeout="auto" unmountOnExit>
								<List
									component="div"
									disablePadding
									style={{ paddingLeft: depth * 20 }}
								>
									{renderTaskItems(task.subtasks, depth + 1)}
								</List>
							</Collapse>
						)}
					</div>
				)}
			</Draggable>
		));
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable-list">
				{(provided) => (
					<List {...provided.droppableProps} ref={provided.innerRef}>
						{renderTaskItems(tasks)}
						{provided.placeholder}
					</List>
				)}
			</Droppable>
		</DragDropContext>
	);
};
TaskHierarchy.propTypes = {
	tasks: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			is_completed: PropTypes.bool.isRequired,
			parent_id: PropTypes.number,
			list_id: PropTypes.number.isRequired,
			subtasks: PropTypes.arrayOf(PropTypes.object),
		})
	).isRequired,
};

export default TaskHierarchy;
