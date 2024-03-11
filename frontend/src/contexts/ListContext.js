import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import ListService from "../services/ListService";

const ListContext = createContext(null);

/** Custom hook to use the list context.
 *
 * @returns {object} - The list context.
 */
export function useLists() {
	const context = useContext(ListContext);
	if (!context) {
		throw new Error(
			"Hook useLists must be used within a ListProvider, or a component wrapped by it"
		);
	}
	return context;
}

export const ListProvider = ({ children }) => {
	const { currentUser } = useAuth();
	const [lists, setLists] = useState([]);
	const [currentListId, setCurrentListId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// Memoizing listService instance to avoid unnecessary re-renders
	const listService = useMemo(() => new ListService(), []);

	/** Function to fetch all lists from the server.
	 *
	 * @returns {Promise<void>} - A promise that resolves to the fetched lists.
	 */
	useEffect(() => {
		const fetchLists = async () => {
			if (!currentUser) {
				setLists([]);
				setCurrentListId(null);
				return;
			}
			setIsLoading(true);
			try {
				const response = await listService.getAllLists();
				setLists(response);
				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLists();
	}, [listService, currentUser]);

	/** Function to create a new list.
	 *
	 * @param {string} name - The name of the new list to be created.
	 * @returns {Promise<void>} - A promise that resolves to the created list.
	 */
	const createList = useCallback(
		async (name) => {
			if (!currentUser) {
				setLists([]);
				setCurrentListId(null);
				return;
			}
			setIsLoading(true);
			try {
				const newList = await listService.createList(name);
				// Update the state with the new list
				setLists((prevLists) => [...prevLists, newList]);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		},
		[listService, currentUser]
	);

	/** Delete a list.
	 *
	 * @param {number} listId - The ID of the list to be deleted.
	 * @returns {Promise<void>} - A promise that resolves to the deleted list.
	 */
	const deleteList = useCallback(
		async (listId) => {
			if (currentUser) {
				const response = await listService.deleteList(listId);
				if (!response.error) {
					setLists((prev) => prev.filter((list) => list.id !== listId));
				}
			}
		},
		[listService, currentUser]
	);

	// Function to edit a list
	const editList = useCallback(
		async (listId, name) => {
			if (!currentUser) {
				setLists([]);
				setCurrentListId(null);
				return;
			}
			setIsLoading(true);
			try {
				await listService.editList(listId, name);
				// If the list is successfully updated, update the state with the new list name
				setLists((prevLists) =>
					prevLists.map((list) =>
						list.id === listId ? { ...list, name } : list
					)
				);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		},
		[currentUser, listService]
	);

	// Function to fetch a specific list by its ID
	const fetchListById = useCallback(
		async (listId) => {
			if (!currentUser) {
				setCurrentListId(null);
				return;
			}
			setIsLoading(true);
			try {
				const fetchedList = await listService.getList(listId);

				// Set the current list ID to the fetched list ID
				setCurrentListId(fetchedList.id);

				// Update the lists state to include the fetched list
				setLists((prevLists) => {
					const existingListIndex = prevLists.findIndex(
						(list) => list.id === fetchedList.id
					);
					if (existingListIndex !== -1) {
						// Update the existing list with the fetched list
						return prevLists.map((list) =>
							list.id === fetchedList.id ? fetchedList : list
						);
					} else {
						// Otherwise, add the fetched list to the state
						return [...prevLists, fetchedList];
					}
				});
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		},
		[currentUser, listService]
	);

	const contextValue = useMemo(
		() => ({
			lists,
			currentListId,
			setCurrentListId,
			isLoading,
			error,
			createList,
			deleteList,
			editList,
			fetchListById,
		}),
		[
			lists,
			currentListId,
			isLoading,
			error,
			createList,
			deleteList,
			editList,
			fetchListById,
		]
	);

	return (
		<ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
	);
};

ListProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ListProvider;
