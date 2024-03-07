import React from "react";
import Navbar from "../components/home/Navbar";
import RegisterForm from "../components/home/RegisterForm";
import { Container, Box } from "@mui/material";

const RegisterPage = () => {
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
					<RegisterForm />
				</Box>
			</Container>
		</>
	);
};

export default RegisterPage;
