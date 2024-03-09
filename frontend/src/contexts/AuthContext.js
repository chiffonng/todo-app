import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import AuthService from "../services/AuthService";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const authService = useMemo(() => new AuthService(), []);

	useEffect(() => {
		console.log("Checking currentUser for authentication:", currentUser);
		setIsAuthenticated(currentUser !== null);
		setLoading(false); // Set loading to false once currentUser is checked
	}, [currentUser]);

	const login = useCallback(
		async (username, password) => {
			console.log("Login attempt:", username);
			setLoading(true);
			try {
				const response = await authService.login(username, password);
				console.log("Login response:", response);
				if (response.status === 200) {
					setCurrentUser(response.data.user);
					setIsAuthenticated(true);
				} else {
					throw new Error(
						response.data ? response.data.message : "An unknown error occurred"
					);
				}
			} catch (error) {
				console.error("Login error:", error);
			} finally {
				setLoading(false);
			}
		},
		[authService]
	);

	const logout = useCallback(async () => {
		console.log("Logout attempt");
		try {
			const response = await authService.logout();
			console.log("Logout response:", response);
			if (response.status === 200) {
				setCurrentUser(null);
				setIsAuthenticated(false);
			} else {
				throw new Error(response.data.message);
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
	}, [authService]);

	const register = useCallback(
		async (username, password) => {
			console.log("Register attempt:", username);
			setLoading(true);
			try {
				const response = await authService.register(username, password);
				console.log("Register response:", response);
				return response;
			} finally {
				setLoading(false);
			}
		},
		[authService]
	);

	const contextValue = useMemo(() => {
		console.log("Updating AuthContext value");
		return {
			currentUser,
			isAuthenticated,
			login,
			logout,
			register,
			loading,
		};
	}, [currentUser, isAuthenticated, login, logout, register]);

	console.log("Rendering AuthProvider", {
		currentUser,
		isAuthenticated,
		loading,
	});

	return (
		<AuthContext.Provider value={contextValue}>
			{!loading ? children : null}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
export default AuthProvider;
