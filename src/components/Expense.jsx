import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/Expense.module.css';

const sampleExpenses = [
    {
        id: 1,
        title: "Groceries",
        category: "Food",
        categoryId: 1,
        amount: 78.45,
        date: "2025-05-12"
    },
    {
        id: 2,
        title: "Rent",
        category: "Housing",
        categoryId: 2,
        amount: 600.00,
        date: "2025-05-01"
    },
    {
        id: 3,
        title: "Dinner Out",
        category: "Entertainment",
        categoryId: 4,
        amount: 56.20,
        date: "2025-05-14"
    },
    {
        id: 4,
        title: "Electric Bill",
        category: "Utilities",
        categoryId: 5,
        amount: 94.73,
        date: "2025-05-10"
    }
];

const mockCategories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Housing' },
    { id: 3, name: 'Transportation' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Utilities' },
    { id: 6, name: 'Healthcare' },
    { id: 7, name: 'Shopping' },
    { id: 8, name: 'Travel' }
];

const ExpenseCard = ({ expense, onDelete, isAuthenticated, categories, isLoading }) => {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : expense.category || 'Unknown';
    };

    const handleEdit = () => {
        if (!isAuthenticated) {
            alert('Please log in to edit expenses.');
            return;
        }
        navigate(`/update-expense?id=${expense.id}`);
    };

    const handleDelete = async () => {
        if (!isAuthenticated) {
            alert('Please log in to delete expenses.');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${expense.title}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setDeleteLoading(true);

        try {
            console.log(`Deleting expense: ${expense.id} - "${expense.title}"`);
            await onDelete(expense.id);
            alert(`Expense "${expense.title}" has been successfully deleted.`);
            console.log(`Successfully deleted expense: ${expense.id}`);
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert(
                `Failed to delete "${expense.title}".\n\n` +
                `Error: ${error.message || 'Unknown error occurred'}\n\n` +
                `Please try again or contact support if the problem persists.`
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const categoryName = getCategoryName(expense.categoryId);

    return (
        <div className={styles.expenseCard}>
            <div className={styles.expenseHeader}>
                <div className={styles.expenseInfo}>
                    <h3 className={styles.expenseTitle}>{expense.title}</h3>
                    <span className={styles.categoryBadge}>{categoryName}</span>
                </div>
                <div className={styles.expenseAmount}>
                    {formatCurrency(expense.amount)}
                </div>
            </div>
            <div className={styles.expenseDate}>
                {formatDate(expense.date)}
            </div>

            {isAuthenticated && (
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.editButton}
                        onClick={handleEdit}
                        disabled={deleteLoading || isLoading}
                    >
                        Edit
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={deleteLoading || isLoading}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

            {!isAuthenticated && (
                <div className={styles.authNotice}>
                    <p>Log in to edit or delete expenses</p>
                </div>
            )}
        </div>
    );
};

const ExpensesHomePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [categories] = useState(mockCategories); // Removed unused setCategories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const fetchExpenses = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }
            setError('');

            console.log('Fetching expenses from API...');

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:8080/api/expenses', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (response.ok) {
                    const apiData = await response.json();
                    console.log('Successfully fetched expenses from API:', apiData);

                    const processedExpenses = apiData.map(expense => ({
                        id: expense.id,
                        title: expense.title || 'Untitled Expense',
                        amount: parseFloat(expense.amount) || 0,
                        category: expense.category || 'Unknown',
                        categoryId: expense.categoryId || null,
                        date: expense.date || new Date().toISOString().split('T')[0]
                    }));

                    setExpenses(processedExpenses);
                    setRetryCount(0);
                    return;
                } else {
                    throw new Error(`API responded with status: ${response.status}`);
                }
            } catch (apiError) {
                console.log('API not available, checking localStorage:', apiError.message);

                const localExpenses = localStorage.getItem('expenses');
                if (localExpenses) {
                    try {
                        const parsedExpenses = JSON.parse(localExpenses);
                        console.log('Found expenses in localStorage:', parsedExpenses);

                        const allExpenses = [...sampleExpenses, ...parsedExpenses];
                        const uniqueExpenses = allExpenses.filter((expense, index, self) =>
                            index === self.findIndex(e => e.id === expense.id)
                        );

                        setExpenses(uniqueExpenses);
                        return;
                    } catch (parseError) {
                        console.error('Error parsing localStorage data:', parseError);
                    }
                }

                console.log('Using sample data as fallback');
                setExpenses(sampleExpenses);
            }
        } catch (fetchError) {
            console.error('Error in fetchExpenses:', fetchError);
            setError('Failed to load expenses. Please try again.');
            setExpenses(sampleExpenses);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            console.log('Storage changed, refreshing expenses...');
            fetchExpenses(false);
        };

        const handleExpenseAdded = () => {
            console.log('New expense added, refreshing list...');
            fetchExpenses(false);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('expenseAdded', handleExpenseAdded);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('expenseAdded', handleExpenseAdded);
        };
    }, []);

    const handleExpenseDelete = async (expenseId) => {
        try {
            console.log(`Starting delete process for expense ID: ${expenseId}`);

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (response.ok) {
                    console.log('Successfully deleted expense via API');
                } else {
                    const errorData = await response.text();
                    throw new Error(`API delete failed: ${response.status} - ${errorData}`);
                }
            } catch (apiError) {
                console.log('API delete failed, updating localStorage:', apiError.message);

                const localExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
                const filteredExpenses = localExpenses.filter(exp => exp.id !== expenseId);
                localStorage.setItem('expenses', JSON.stringify(filteredExpenses));

                console.log('Updated localStorage, continuing with local state update');
            }

            setExpenses(prev => {
                const updated = prev.filter(expense => expense.id !== expenseId);
                console.log(`Removed expense from UI. Remaining: ${updated.length} expenses`);
                return updated;
            });

        } catch (deleteError) {
            console.error('Error in handleExpenseDelete:', deleteError);
            throw new Error(deleteError.message || 'Failed to delete expense');
        }
    };

    const handleCreateNew = () => {
        if (!isAuthenticated) {
            alert('Please log in to create expenses.');
            navigate('/login');
            return;
        }
        navigate('/create-expense');
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        fetchExpenses();
    };

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <h3>Loading expenses...</h3>
                    <p>Please wait while we fetch your data</p>
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
                        {!isAuthenticated && (
                            <span className={styles.loginPrompt}> - Please log in to manage your expenses</span>
                        )}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => fetchExpenses()}
                        className={styles.refreshButton}
                    >
                        Refresh
                    </button>
                    {isAuthenticated && (
                        <button
                            onClick={handleCreateNew}
                            className={styles.createButton}
                        >
                            Add New Expense
                        </button>
                    )}
                </div>
            </div>
            {!isAuthenticated && (
                <div className={styles.authNoticeCard}>
                    <h3>Login Required</h3>
                    <p>To create, edit, or delete expenses, please log in to your account.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className={styles.loginButton}
                    >
                        Log In
                    </button>
                </div>
            )}
            <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <h3 className={styles.summaryValue}>{expenseCount}</h3>
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
                    <h4>Error Loading Expenses</h4>
                    <p>{error}</p>
                    <button onClick={handleRetry} className={styles.retryButton}>
                        Retry ({retryCount})
                    </button>
                </div>
            )}

            {expenses.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No Expenses Found</h3>
                    <p>
                        {isAuthenticated
                            ? "Start tracking your expenses by adding your first one!"
                            : "Please log in to view and manage your expenses."
                        }
                    </p>
                    {isAuthenticated && (
                        <button onClick={handleCreateNew} className={styles.createButtonLarge}>
                            Create Your First Expense
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.expensesSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Expenses</h2>
                        <div className={styles.sectionMeta}>
                            Showing {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
                            {isAuthenticated && (
                                <span className={styles.authBadge}>Authenticated</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.expensesList}>
                        {expenses.map(expense => (
                            <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                onDelete={handleExpenseDelete}
                                isAuthenticated={isAuthenticated}
                                categories={categories}
                                isLoading={loading}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesHomePage;