import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/Expense.module.css';

const categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Health' },
    { id: 4, name: 'Sports' },
];


const ExpenseCard = ({ expense, onDelete, isAuthenticated }) => {
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };



    const getCategoryName = () => {
        if (expense.category) {
            if (typeof expense.category === 'object' && expense.category.name) {
                return expense.category.name;
            }
            if (typeof expense.category === 'string') {
                return expense.category;
            }
        }

        if (expense.categoryId) {
            const cat = categories.find(c => c.id === expense.categoryId);
            if (cat) return cat.name;
        }

        return 'Other';
    };

    const handleEdit = () => {
        if (!isAuthenticated) {
            alert('Please log in to edit.');
            return;
        }
        navigate(`/update-expense?id=${expense.id}`);
    };

    const handleDelete = async () => {
        if (!isAuthenticated) {
            alert('Please log in to delete.');
            return;
        }

        if (!confirm(`Delete "${expense.title}"?`)) return;

        setDeleting(true);
        try {
            await onDelete(expense.id);
        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
        setDeleting(false);
    };

    const amount = expense.value || expense.amount || 0;
    const title = expense.title || 'Untitled';

    return (
        <div className={styles.expenseCard}>
            <div className={styles.expenseHeader}>
                <div className={styles.expenseInfo}>
                    <h3 className={styles.expenseTitle}>{title}</h3>
                    <span className={styles.categoryBadge}>{getCategoryName()}</span>
                </div>
                <div className={styles.expenseAmount}>
                    {formatMoney(amount)}
                </div>
            </div>


            {isAuthenticated && (
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.editButton}
                        onClick={handleEdit}
                        disabled={deleting}
                    >
                        Edit
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

            {!isAuthenticated && (
                <div className={styles.authNotice}>
                    <p>Log in to edit or delete</p>
                </div>
            )}
        </div>
    );
};

const ExpensesHomePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/expenses', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setExpenses(data || []);
                setError('');
            } else {
                console.log('API not available, using sample data');
                setExpenses(sampleExpenses);
                setError('Using sample data (API not connected)');
            }
        } catch (err) {
            console.log('Network error, using sample data');
            setExpenses(sampleExpenses);
            setError('Using sample data (Backend not running)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setExpenses(prev => prev.filter(exp => exp.id !== id));
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            console.log('API delete failed, removing from local state');
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        }
    };

    const totalAmount = expenses.reduce((sum, exp) => {
        const amount = parseFloat(exp.value || exp.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <h3>Loading expenses...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>My Expenses</h1>
                    <p className={styles.pageDescription}>
                        {!isAuthenticated && 'Please log in to manage expenses'}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={loadExpenses} className={styles.refreshButton}>
                        Refresh
                    </button>
                    {isAuthenticated && (
                        <button onClick={() => navigate('/create-expense')} className={styles.createButton}>
                            Add Expense
                        </button>
                    )}
                </div>
            </div>

            {!isAuthenticated && (
                <div className={styles.authNoticeCard}>
                    <h3>Login Required</h3>
                    <p>Log in to create, edit, or delete expenses.</p>
                    <button onClick={() => navigate('/login')} className={styles.loginButton}>
                        Log In
                    </button>
                </div>
            )}

            <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <h3 className={styles.summaryValue}>{expenses.length}</h3>
                        <p className={styles.summaryLabel}>Total Expenses</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <h3 className={styles.summaryValue}>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(totalAmount)}
                        </h3>
                        <p className={styles.summaryLabel}>Total Amount</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className={styles.errorContainer}>
                    <h4>Notice</h4>
                    <p>{error}</p>
                    <button onClick={loadExpenses} className={styles.retryButton}>
                        Try Again
                    </button>
                </div>
            )}

            {expenses.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No expenses yet</h3>
                    <p>
                        {isAuthenticated
                            ? "Add your first expense to get started!"
                            : "Log in to view your expenses."
                        }
                    </p>
                    {isAuthenticated && (
                        <button onClick={() => navigate('/create-expense')} className={styles.createButtonLarge}>
                            Add First Expense
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.expensesSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Expenses</h2>
                        <div className={styles.sectionMeta}>
                            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
                            {isAuthenticated && <span className={styles.authBadge}>Logged In</span>}
                        </div>
                    </div>
                    <div className={styles.expensesList}>
                        {expenses.map(expense => (
                            <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                onDelete={deleteExpense}
                                isAuthenticated={isAuthenticated}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesHomePage;