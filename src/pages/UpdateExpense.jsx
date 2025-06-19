import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/UpdateExpense.module.css';

const categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Health' },
    { id: 4, name: 'Sports' },
];

function UpdateExpense() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();

    const expenseId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [originalExpense, setOriginalExpense] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!expenseId) {
            navigate('/');
            return;
        }
        loadExpense();
    }, [isAuthenticated, expenseId, navigate]);

    const loadExpense = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/expense/${expenseId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const expense = await response.json();
                setOriginalExpense(expense);
                setTitle(expense.title || '');
                setAmount(expense.value?.toString() || '');
                setCategoryId(expense.categoryId?.toString() || '');
                setError('');
            } else {
                setError('Backend not available - using demo data');
                const demoExpense = { id: expenseId, title: 'Demo Expense', value: 50, categoryId: 1 };
                setOriginalExpense(demoExpense);
                setTitle(demoExpense.title);
                setAmount(demoExpense.value.toString());
                setCategoryId(demoExpense.categoryId.toString());
            }
        } catch (err) {
            setError('Backend server not running');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !amount || !categoryId) {
            setError('Please fill in all required fields');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: title.trim(),
                    value: numAmount,
                    categoryId: parseInt(categoryId)
                })
            });

            if (response.ok) {
                alert('Expense updated!');
                navigate('/');
            } else {
                setError('Backend not available - changes not saved');
            }
        } catch (err) {
            setError('Backend server not running - check console');
            console.log('Backend error:', err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (confirm('Cancel changes?')) {
            navigate('/');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (!expenseId) {
        return (
            <div className={styles.container}>
                <div className={styles.errorPage}>
                    <h2>No expense selected</h2>
                    <button onClick={() => navigate('/')} className={styles.backButton}>
                        Back to Expenses
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingContent}>
                        <div className={styles.largeSpinner}></div>
                        <h3>Loading expense...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !originalExpense) {
        return (
            <div className={styles.container}>
                <div className={styles.errorPage}>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <div className={styles.errorActions}>
                        <button onClick={loadExpense} className={styles.retryButton}>
                            Try Again
                        </button>
                        <button onClick={() => navigate('/')} className={styles.backButton}>
                            Back to Expenses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isValid = title.trim() && amount && categoryId;

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                {error && (
                    <div className={styles.errorMessage}>
                        <div>
                            <h4>Error</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formHeader}>
                        <button onClick={handleCancel} className={styles.backButton} type="button">
                            Back to Expenses
                        </button>
                        <h2>Edit Expense</h2>
                        {originalExpense && (
                            <p className={styles.originalInfo}>
                                Currently: "{originalExpense.title}" - {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(originalExpense.value)}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Expense Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter expense title"
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amount" className={styles.label}>
                            Amount
                        </label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="categoryId" className={styles.label}>
                            Category
                        </label>
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={saving}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>



                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || saving}
                            className={`${styles.submitButton} ${!isValid || saving ? styles.disabled : ''}`}
                        >
                            {saving ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Expense'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateExpense;