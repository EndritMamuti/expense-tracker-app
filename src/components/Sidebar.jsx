import styles from '../styles/Sidebar.module.css';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, closeSidebar }) {
    const sidebarClass = isOpen
        ? `${styles.sidebar} ${styles.open}`
        : styles.sidebar;

    const handleLinkClick = () => {
        if (closeSidebar) {
            closeSidebar();
        }
    };

    return (
        <div className={sidebarClass}>
            <nav className={styles.navigation}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/Expenses"
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                            onClick={handleLinkClick}
                        >
                            <span className={styles.text}>Expenses</span>
                        </NavLink>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/CreateExpenses"
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                            onClick={handleLinkClick}
                        >
                            <span className={styles.text}>Create New Expense</span>
                        </NavLink>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink
                            to="/Login"
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                            onClick={handleLinkClick}
                        >
                            <span className={styles.text}>Login/Signup</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;