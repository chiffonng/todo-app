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
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

const LoginForm = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleClickShowPassword = () =>
		setShowPassword((prevShowPassword) => !prevShowPassword);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	// Validate form fields
	const isFormValid = () => {
		if (!username || !password) {
			setErrorMessage("All fields are required");
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
			await login(username, password);
			navigate(ROUTES.HOME);
		} catch (error) {
			setErrorMessage(error.message);
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
					Log in
				</Typography>
				{errorMessage && (
					<Alert severity="error" sx={{ m: 2, alignItems: "flex-start" }}>
						{errorMessage}
					</Alert>
				)}
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
						type={showPassword ? "text" : "password"}
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
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
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
						Log In
					</Button>
					<Grid container>
						<Grid item xs></Grid>
						<Grid item>
							<Link href={ROUTES.REGISTER} variant="body2">
								{"Don't have an account? Resgister here"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Grid>
	);
};

export default LoginForm;
