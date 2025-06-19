import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/check', {
                    method: 'GET',
                    credentials: 'include'
                });

                setIsAuthenticated(response.ok);
            } catch (error) {
                console.log('Auth check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let message = 'Login failed';
                try {
                    const errorData = JSON.parse(errorText);
                    message = errorData.message || message;
                } catch (e) {
                }
                return { success: false, error: message };
            }

            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: 'Network error. Please check if the backend is running.'
            };
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = 'Signup failed';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                }
                return { success: false, error: errorMsg };
            }

            const result = await response.json();
            return {
                success: true,
                message: result.message || 'Account created! You can now log in.'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Network error. Is the backend running?'
            };
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};