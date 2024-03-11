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

const AuthContext = createContext(null);

/** Custom hook to use the authentication context.
 *
 * @returns {object} - The authentication context.
 */

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			"Hook useAuth must be used within an AuthProvider, or a component wrapped by it"
		);
	}
	return context;
}

/** Provider component to wrap the application and provide authentication context.
 *
 * @param {object} children - The children to render.
 * @returns {object} - The authentication context provider.
 **/
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const authService = useMemo(() => new AuthService(), []);

	const login = useCallback(
		async (username, password) => {
			setIsLoading(true);
			try {
				const response = await authService.login(username, password);
				if (response && response.username) {
					setCurrentUser(response);
					setIsAuthenticated(true);
					return response;
				}
			} catch (error) {
				console.error("Login error:", error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[authService]
	);

	const register = useCallback(
		async (username, password) => {
			setIsLoading(true);
			try {
				const response = await authService.register(username, password);
				if (response && response.username) {
					return response;
				}
			} catch (error) {
				console.error("Registration error:", error);
				throw error;
			}
			setIsLoading(false);
		},
		[authService]
	);

	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
			await authService.logout();
			setCurrentUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
		setIsLoading(false);
	}, [authService]);

	const getCurrentUser = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await authService.getCurrentUser();
			if (response) {
				setCurrentUser(response);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			setIsAuthenticated(false);
			console.error("Error fetching current user:", error);
		}
		setIsLoading(false);
	}, [authService]);

	useEffect(() => {
		getCurrentUser();
	}, [getCurrentUser]);

	const contextValue = useMemo(
		() => ({
			currentUser,
			isAuthenticated,
			isLoading,
			login,
			logout,
			register,
			getCurrentUser,
		}),
		[
			currentUser,
			isAuthenticated,
			isLoading,
			login,
			logout,
			register,
			getCurrentUser,
		]
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
