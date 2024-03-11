import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { CssBaseline, List } from "@mui/material";
import theme from "./theme";

import { AuthProvider } from "./contexts/AuthContext";
import { ListProvider } from "./contexts/ListContext";
import { TaskProvider } from "./contexts/TaskContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/404";
import MainPage from "./pages/MainPage";

import { ROUTES } from "./utils/constants";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<CssBaseline />
				<Container
					component="main"
					maxWidth="false"
					sx={{ height: "100vh", padding: 0 }}
				>
					<AuthProvider>
						<Routes>
							<Route path={ROUTES.LOGIN} element={<LoginPage />} />
							<Route path={ROUTES.REGISTER} element={<RegisterPage />} />
							<Route path={ROUTES.MAIN} element={<MainPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
						<ListProvider>
							<TaskProvider></TaskProvider>
						</ListProvider>
					</AuthProvider>
				</Container>
			</Router>
		</ThemeProvider>
	);
}

export default App;
