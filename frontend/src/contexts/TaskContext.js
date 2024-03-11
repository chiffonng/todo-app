import React, {
	createContext,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from "react";
import PropTypes from "prop-types";
import TaskService from "../services/TaskService";
import { useAuth } from "./AuthContext";
import { useLists } from "./ListContext";

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
	const { currentUser } = useAuth();
	const { currentListId } = useLists();
	const [tasks, setTasks] = useState([]);

	// Memoizing taskService instance to avoid unnecessary re-renders
	const taskService = useMemo(() => new TaskService(), []);

	// Helper function to check if currentUser and currentListId are not null
	const checkUserAndListId = useCallback(() => {
		if (!currentUser || !currentListId) {
			throw new Error("User not authenticated or List ID is not available");
		}
	}, [currentUser, currentListId]);

	// Then use this function in your other functions like this:

	const fetchTasks = useCallback(async () => {
		try {
			checkUserAndListId();
			const response = await taskService.getAllTasks(currentListId);
			if (response.ok) {
				setTasks((prev) => ({ ...prev, [currentListId]: response.body }));
			}
		} catch (error) {
			console.error(error);
		}
	}, [currentListId, taskService, checkUserAndListId]);

	// Do the same for all other functions

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	// Function to retrieve a specific task
	const getTask = useCallback(
		async (taskId) => {
			try {
				checkUserAndListId();
				const response = await taskService.getTask(currentListId, taskId);
				if (response.ok) {
					setTasks((prev) => {
						const updatedTasks = prev[currentListId].map((task) =>
							task.id === taskId ? { ...task, ...response.body } : task
						);
						return { ...prev, [currentListId]: updatedTasks };
					});
				}
				return response;
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId]
	);

	// Function to retrieve subtasks of a specific task
	const getSubtasks = useCallback(
		async (parentId) => {
			try {
				checkUserAndListId();
				const response = await taskService.getSubtasks(currentListId, parentId);
				if (response.ok) {
					setTasks((prev) => {
						const updatedTasks = { ...prev };

						// Find the parent task index in the current list's array of tasks.
						const parentIndex = updatedTasks[currentListId]?.findIndex(
							(task) => task.id === parentId
						);

						// If parent task is found, update its 'subtasks' property.
						if (parentIndex !== -1) {
							const newParentTask = {
								...updatedTasks[currentListId][parentIndex],
								subtasks: response.body.subtasks,
							};

							updatedTasks[currentListId] = [
								...updatedTasks[currentListId].slice(0, parentIndex),
								newParentTask,
								...updatedTasks[currentListId].slice(parentIndex + 1),
							];
						}

						return updatedTasks;
					});

					return { subtasks: response.body.subtasks };
				} else {
					throw new Error(response.error || "Failed to retrieve subtasks");
				}
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId]
	);

	// Function to create a new task
	const createTask = useCallback(
		async (taskData) => {
			try {
				checkUserAndListId();
				const response = await taskService.createTask(currentListId, taskData);
				if (response) {
					setTasks((prev) => ({
						...prev,
						[currentListId]: [...(prev[currentListId] || []), response.body],
					}));
					return { task: response.body };
				} else {
					throw new Error(
						response.status === 400 ? "Invalid input" : "Failed to create task"
					);
				}
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId]
	);

	// Function to create a new subtask for a specific parent task
	const createSubtask = useCallback(
		async (parentTaskId, subtaskData) => {
			try {
				checkUserAndListId();
				// Make a request to the task service to create a subtask
				const response = await taskService.createSubtask(
					currentListId,
					parentTaskId,
					subtaskData
				);

				// If the response status is 201 (Created), proceed to update the tasks state
				if (response.status === 201) {
					setTasks((prev) => {
						// Check if the current list already exists in the state, if not, initialize it
						const updatedTasks = prev[currentListId]
							? { ...prev[currentListId] }
							: {};

						// Find and update the parent task
						const parentTask = updatedTasks[parentTaskId];
						if (parentTask) {
							parentTask.subtasks = [
								...(parentTask.subtasks || []),
								response.body,
							];
						} else {
							// Optionally handle case where parent task isn't found
							updatedTasks[parentTaskId] = {
								id: parentTaskId,
								subtasks: [response.body],
							};
						}

						// Return the updated tasks state
						return { ...prev, [currentListId]: updatedTasks };
					});

					// Return the created subtask
					return { subtask: response.body };
				} else {
					// Handle different status codes for errors
					throw new Error(
						response.status === 404
							? "Parent task not found"
							: "Failed to create subtask"
					);
				}
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId]
	);

	// Function to delete a task
	const deleteTask = useCallback(
		async (taskId) => {
			try {
				checkUserAndListId();
				const response = await taskService.deleteTask(currentListId, taskId);
				if (response.ok) {
					setTasks((prev) => {
						const updatedTasks = prev[currentListId].filter(
							(task) => task.id !== taskId
						);
						return { ...prev, [currentListId]: updatedTasks };
					});
				}
				return response;
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId, setTasks]
	);

	// Function to edit a task
	const editTask = useCallback(
		async (taskId, taskData) => {
			try {
				checkUserAndListId();
				const response = await taskService.editTask(
					currentListId,
					taskId,
					taskData
				);
				if (response.ok) {
					setTasks((prev) => {
						const updatedTasks = prev[currentListId].map((task) =>
							task.id === taskId ? { ...task, ...taskData } : task
						);
						return { ...prev, [currentListId]: updatedTasks };
					});
				}
				return response;
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, checkUserAndListId, setTasks]
	);

	// Function to move a task to a different list
	const moveTask = useCallback(
		async (taskId, newListId) => {
			try {
				checkUserAndListId();
				const response = await taskService.moveTask(
					taskId,
					currentListId,
					newListId
				);
				if (response.status === 200) {
					fetchTasks();
					return { message: response.data.message };
				} else {
					// Handle different status codes based on backend responses
					let errorMessage = "Failed to move the task";
					if (response.status === 404) {
						errorMessage = "Task not found";
					} else if (response.status === 400) {
						errorMessage = "New list ID not found";
					}
					throw new Error(errorMessage);
				}
			} catch (error) {
				return { error: error.message };
			}
		},
		[currentListId, taskService, fetchTasks, checkUserAndListId]
	);

	// Function to update the status of a task
	const updateTaskStatus = useCallback(
		async (taskId, status) => {
			try {
				checkUserAndListId();
				const response = await taskService.updateTaskStatus(
					currentListId,
					taskId,
					status
				);
				if (response.status === 200) {
					setTasks((prev) => {
						const updatedTasks = prev[currentListId].map((task) =>
							task.id === taskId ? { ...task, status } : task
						);
						return { ...prev, [currentListId]: updatedTasks };
					});
					return { message: response.data.message };
				} else {
					// Handle different status codes based on backend responses
					let errorMessage = "Failed to update task status";
					if (response.status === 404) {
						errorMessage = "Task not found";
					} else if (response.status === 400) {
						errorMessage = "Invalid status";
					}
					throw new Error(errorMessage);
				}
			} catch (error) {
				return { error: error.message };
			}
		},
		[checkUserAndListId, currentListId, taskService, setTasks]
	);

	const contextValue = useMemo(
		() => ({
			tasks,
			fetchTasks,
			getTask,
			getSubtasks,
			createTask,
			createSubtask,
			deleteTask,
			editTask,
			moveTask,
			updateTaskStatus,
		}),
		[
			tasks,
			fetchTasks,
			getTask,
			getSubtasks,
			createTask,
			createSubtask,
			deleteTask,
			editTask,
			moveTask,
			updateTaskStatus,
		]
	);

	return (
		<TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
	);
};

TaskProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useTasks = () => useContext(TaskContext);

export default TaskProvider;
