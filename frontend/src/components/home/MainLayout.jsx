import React from "react";
import Grid from "@mui/material/Grid";
import ListSidebar from "../list/ListSidebar";
import TaskLayout from "../task/TaskLayout";
import EmptyListPrompt from "../list/EmptyListPrompt";
import { useLists } from "../../contexts/ListContext";

const MainLayout = () => {
	const { lists, currentListId, fetchListById } = useLists();

	const currentList = fetchListById(currentListId);

	return (
		<Grid container>
			<Grid item xs={4}>
				<ListSidebar lists={lists} currentListId={currentListId} />
			</Grid>
			<Grid item xs={8}>
				{lists.length === 0 ? (
					<EmptyListPrompt />
				) : (
					<TaskLayout listName={currentList?.name} />
				)}
			</Grid>
		</Grid>
	);
};

export default MainLayout;
