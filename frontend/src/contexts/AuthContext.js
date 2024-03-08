import React, {
	createContext,
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

	// Memoizing authService instance
	const authService = useMemo(() => new AuthService(), []);

	useEffect(() => {
		setIsAuthenticated(currentUser !== null);
	}, [currentUser]);

	// Function to update user state on successful login
	const login = useCallback(
		async (username, password) => {
			setLoading(true);
			const response = await authService.login(username, password);
			if (!response.error) {
				setCurrentUser(response);
				localStorage.setItem("user", JSON.stringify(response));
			}
			setLoading(false);
			return response;
		},
		[authService]
	);

	// Function to clear user state on logout
	const logout = useCallback(async () => {
		const response = await authService.logout();
		if (response.success) {
			setCurrentUser(null);
			localStorage.removeItem("user");
		}
		return response;
	}, [authService]);

	// Function to update user state on successful registration
	const register = useCallback(
		async (username, password) => {
			setLoading(true);
			const response = await authService.register(username, password);
			setLoading(false);
			return response;
		},
		[authService]
	);

	useEffect(() => {
		// Check if user data is stored in local storage and update state
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setCurrentUser(user);
		}
		setLoading(false);
	}, []);

	return useMemo(
		() => (
			<AuthContext.Provider
				value={{
					currentUser,
					isAuthenticated,
					login,
					logout,
					register,
					loading,
				}}
			>
				{!loading && children}
			</AuthContext.Provider>
		),
		[currentUser, isAuthenticated, login, logout, register, loading, children]
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
