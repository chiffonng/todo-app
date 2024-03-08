import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { CssBaseline } from "@mui/material";
import theme from "./theme";

import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/404";

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
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</AuthProvider>
				</Container>
			</Router>
		</ThemeProvider>
	);
}

export default App;
