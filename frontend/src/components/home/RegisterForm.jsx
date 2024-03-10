import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

export default function RegisterForm() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Toggle password visibility for password and confirm password fields
	const handlePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const handleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	// Validate form fields
	const isFormValid = () => {
		if (!username || !password || !confirmPassword) {
			setErrorMessage("All fields are required");
			return false;
		} else if (password.length < 6) {
			setErrorMessage("Password must be at least 6 characters long");
			return false;
		} else if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage(""); // Reset error message
		if (!isFormValid()) {
			return;
		}
		try {
			const response = await register(username, password);
			if (response.error) {
				setErrorMessage(response.error);
			} else {
				// Redirect to login page
				navigate(ROUTES.LOGIN);
			}
		} catch (error) {
			console.error(error);
			setErrorMessage("Signup failed. Please try again.");
		}
	};

	return (
		<Grid
			container
			component="main"
			sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}
		>
			<CssBaseline />
			<Paper
				elevation={6}
				sx={{
					p: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: 400, // Fixed size width
					mx: "auto", // Horizontally centers the Paper component in its Grid container
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Register
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					{errorMessage && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{errorMessage}
						</Alert>
					)}
					<TextField
						margin="normal"
						required
						fullWidth
						id="username"
						label="Username"
						name="username"
						autoComplete="username"
						autoFocus
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PersonIcon />
								</InputAdornment>
							),
						}}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? "text" : "password"} // Toggle between text and password
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockOutlinedIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handlePasswordVisibility}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="confirmPassword"
						label="Confirm Password"
						type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockOutlinedIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle confirm password visibility"
										onClick={handleConfirmPasswordVisibility}
									>
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Register
					</Button>
					<Grid container>
						<Grid item>
							<Link href={ROUTES.LOGIN} variant="body2">
								{"Have an account? Log in"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Grid>
	);
}
