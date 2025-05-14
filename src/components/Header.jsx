import styles from '../styles/Header.module.css';

function Header({ toggleSidebar }) {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.menuIconContainer}>
                    <button
                        className={styles.menuButton}
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar menu"
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
        </header>
    );
}

export default Header;