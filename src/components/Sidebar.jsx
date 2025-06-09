import styles from '../styles/Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Sidebar({ isOpen, closeSidebar }) {
    const { isAuthenticated } = useAuth();

    const sidebarClass = isOpen
        ? `${styles.sidebar} ${styles.open}`
        : styles.sidebar;

    const handleLinkClick = () => {
        closeSidebar();
    };

    return (
        <div className={sidebarClass}>
            <nav className={styles.navigation}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                            onClick={handleLinkClick}
                        >
                            <span className={styles.text}>Expenses</span>
                        </NavLink>
                    </li>

                    {isAuthenticated && (
                        <li className={styles.navItem}>
                            <NavLink
                                to="/create-expense"
                                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                                onClick={handleLinkClick}
                            >
                                <span className={styles.text}>Create New Expense</span>
                            </NavLink>
                        </li>
                    )}

                    {!isAuthenticated && (
                        <li className={styles.navItem}>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                                onClick={handleLinkClick}
                            >
                                <span className={styles.text}>Login/Signup</span>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;