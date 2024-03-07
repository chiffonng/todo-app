import React from "react";
import Navbar from "../components/home/Navbar";
import LoginForm from "../components/home/LoginForm";
import { Container, Box } from "@mui/material";

const LoginPage = () => {
	return (
		<>
			<Navbar />
			<Container
				component="main"
				sx={{
					height: "calc(90vh)",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<LoginForm />
				</Box>
			</Container>
		</>
	);
};

export default LoginPage;
