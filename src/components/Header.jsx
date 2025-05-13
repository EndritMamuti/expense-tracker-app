import styles from "../styles/Header.module.css";

function Header() {
    return(
<header>
    <div className={styles.container}>
    <h1 className={styles.title}>
        Expense tracker
    </h1>
    </div>
</header>
    );
}
export default Header;

