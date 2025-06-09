import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Header.module.css';

function Header({ toggleSidebar }) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <div className={styles.menuIconContainer}>
                        <button
                            className={styles.menuButton}
                            onClick={toggleSidebar}
                        >
                            <div className={styles.hamburger}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                    </div>
                    <h1 className={styles.title}>Expense Tracker</h1>
                </div>

                {isAuthenticated && (
                    <div className={styles.rightSection}>
                        <button
                            className={styles.logoutButton}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;