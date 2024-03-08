import React, { useState } from "react";
import List from "@mui/material/List";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Collapse from "@mui/material/Collapse";
import TaskItem from "./TaskItem"; // Make sure to use your actual TaskItem component

const NestedLayout = ({ tasks }) => {
	const [open, setOpen] = useState({});

	const handleToggleSubtasks = (id) => {
		setOpen((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
	};

	const onDragEnd = (result) => {
		// TODO: onDragEnd logic
	};

	const renderListItems = (items, depth = 0) => {
		if (!Array.isArray(items)) {
			console.error("The items are not an array:", items);
			throw new Error("The items are not an array");
		}
		return items.map((task, index) => (
			<Draggable key={task.id} draggableId={task.id} index={index}>
				{(provided) => (
					<div ref={provided.innerRef} {...provided.draggableProps}>
						<TaskItem
							task={task}
							index={index}
							onToggleSubtasks={handleToggleSubtasks}
							subtasksVisible={!!open[task.id]}
							{...provided.dragHandleProps} // pass drag handle props to TaskItem if needed
						/>
						{task.subtasks && (
							<Collapse in={open[task.id]} timeout="auto" unmountOnExit>
								<List
									component="div"
									disablePadding
									style={{ paddingLeft: depth * 20 }}
								>
									{renderListItems(task.subtasks, depth + 1)}
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
						{renderListItems(tasks)}
						{provided.placeholder}
					</List>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default NestedLayout;
