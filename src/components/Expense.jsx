import { useState } from 'react';
import styles from '../styles/Expense.module.css';

const sampleExpenses = [
    {
        id: 1,
        title: "Groceries",
        category: "Food",
        amount: 78.45,
        date: "2025-05-12"
    },
    {
        id: 2,
        title: "Rent",
        category: "Housing",
        amount: 600.00,
        date: "2025-05-01"
    },
    {
        id: 3,
        title: "Dinner",
        category: "Entertainment",
        amount: 56.20,
        date: "2025-05-14"
    },
    {
        id: 4,
        title: "Electric Bill",
        category: "Utilities",
        amount: 94.73,
        date: "2025-05-10"
    }
];


const ExpenseCard = ({ expense }) => {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    return (
        <div className={styles.expenseCard}>
            <div className={styles.expenseHeader}>
                <div className={styles.expenseInfo}>
                    <h3 className={styles.expenseTitle}>{expense.title}</h3>
                    <div className={styles.categoryWrapper}>
                        <span>{expense.category}</span>
                    </div>
                </div>
                <div className={styles.expenseAmount}>
                    {formatCurrency(expense.amount)}
                </div>
            </div>

            <div className={styles.expenseDate}>
                {formatDate(expense.date)}
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.editButton}>
                    Edit
                </button>
                <button className={styles.deleteButton}>
                    Delete
                </button>
            </div>
        </div>
    );
};

const Expenses = () => {
    const [expenses] = useState(sampleExpenses);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>My Expenses</h2>

            <div className={styles.expensesList}>
                {expenses.map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                ))}
            </div>
        </div>
    );
};

export default Expenses;