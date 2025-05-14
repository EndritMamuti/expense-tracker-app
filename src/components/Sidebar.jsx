import styles from '../styles/Sidebar.module.css';

function Sidebar({ isOpen }) {
    const sidebarClass = isOpen
        ? `${styles.sidebar} ${styles.open}`
        : styles.sidebar;

    return (
        <div className={sidebarClass}>
            <nav className={styles.navigation}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <a href="#" className={styles.navLink}>
                            <span className={styles.text}>Home</span>
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="#" className={styles.navLink}>
                            <span className={styles.text}>Create New Expense</span>
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="#" className={styles.navLink}>
                            <span className={styles.text}>Login/Signup</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;