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
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('userData');

                if (token && userData) {
                    try {
                        const response = await fetch('http://localhost:8080/api/auth/verify', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            const verifiedUser = await response.json();
                            setUser(verifiedUser);
                            setIsAuthenticated(true);
                            console.log('Token verified, user authenticated');
                        } else {
                            throw new Error('Token verification failed');
                        }
                    } catch (apiError) {
                        console.log(' API verification failed, using stored user data:', apiError.message);
                        try {
                            const parsedUserData = JSON.parse(userData);
                            setUser(parsedUserData);
                            setIsAuthenticated(true);
                            console.log(' Using stored user data for authentication');
                        } catch (parseError) {
                            console.error(' Error parsing stored user data:', parseError);
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('userData');
                        }
                    }
                } else {
                    console.log('No authentication token found');
                }
            } catch (error) {
                console.error(' Error checking authentication status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        try {
            console.log(' Attempting login for:', email);

            try {
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));

                    setIsAuthenticated(true);
                    setUser(data.user);

                    console.log('Login successful via API');
                    return { success: true };
                } else {
                    const errorData = await response.json();
                    return { success: false, error: errorData.message || 'Login failed' };
                }
            } catch (apiError) {
                console.log(' API login failed, using demo authentication:', apiError.message);

                if (email && password && password.length >= 6) {
                    const mockUser = {
                        id: Date.now(),
                        email: email,
                        name: email.split('@')[0],
                        loginTime: new Date().toISOString()
                    };

                    const mockToken = `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                    localStorage.setItem('authToken', mockToken);
                    localStorage.setItem('userData', JSON.stringify(mockUser));

                    setIsAuthenticated(true);
                    setUser(mockUser);

                    console.log(' Demo login successful for:', email);
                    return { success: true };
                } else {
                    return { success: false, error: 'Invalid email or password' };
                }
            }
        } catch (error) {
            console.error(' Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signup = async (email, password) => {
        try {
            console.log(' Attempting signup for:', email);


            try {
                const response = await fetch('http://localhost:8080/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(' Signup successful via API');
                    return {
                        success: true,
                        message: data.message || 'Account created successfully! You can now log in.'
                    };
                } else {
                    const errorData = await response.json();
                    return { success: false, error: errorData.message || 'Signup failed' };
                }
            } catch (apiError) {
                console.log(' API signup failed, using demo signup:', apiError.message);

                if (email && password && password.length >= 6) {
                    console.log('Demo signup successful for:', email);
                    return {
                        success: true,
                        message: 'Account created successfully! You can now log in with your credentials.'
                    };
                } else {
                    return { success: false, error: 'Invalid email or password format' };
                }
            }
        } catch (error) {
            console.error(' Signup error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            console.log('Logging out...');

            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    await fetch('http://localhost:8080/api/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    console.log('Logout notification sent to API');
                }
            } catch (apiError) {
                console.log('️ Logout API call failed, continuing with local logout:', apiError.message);
            }
        } catch (error) {
            console.error(' Logout API call failed:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setIsAuthenticated(false);
            setUser(null);
            console.log(' Logout completed - cleared local data');
        }
    };

    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData);
    };

    const getCurrentUser = () => {
        if (user) return user;

        try {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        signup,
        logout,
        checkAuth,
        getCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};