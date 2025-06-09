import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from "../styles/Login.module.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e, action) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Fill all fields');
            setIsLoading(false);
            return;
        }

        if (!isValidEmail(email)) {
            setError('Enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            if (action === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    navigate(from, { replace: true });
                } else {
                    setError(result.error);
                }
            } else if (action === 'signup') {
                const result = await signup(email, password);
                if (result.success) {
                    setSuccessMessage(result.message);
                    setEmail('');
                    setPassword('');
                } else {
                    setError(result.error);
                }
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className={styles.login}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>Welcome to Expense Tracker</h2>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.loginButton}`}
                            onClick={(e) => handleSubmit(e, 'login')}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        <button
                            type="button"
                            className={`${styles.button} ${styles.signupButton}`}
                            onClick={(e) => handleSubmit(e, 'signup')}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Signup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;