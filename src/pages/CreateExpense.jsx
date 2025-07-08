import styles from "../styles/CreateExpense.module.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const categories = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Health' },
    { id: 4, name: 'Sports' },
];

function CreateExpense() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const isValid = title.trim() && amount && categoryId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid) {
            setError('Please fill in all fields.');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: title.trim(),
                    value: numAmount,
                    categoryId: parseInt(categoryId)
                })
            });

            console.log('Response status:', response.status);
            console.log('Response statusText:', response.statusText);

            if (response.ok) {
                alert('Expense created!');
                navigate('/');
            } else {
                let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.text();
                    console.log('Error response body:', errorData);
                    errorMessage += `\nServer message: ${errorData}`;
                } catch (e) {
                    console.log('Could not read error response body');
                }

                setError(errorMessage);
            }
        } catch (err) {
            setError('Backend server not running - check console');
            console.log('Network error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.content}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingContent}>
                        <div className={styles.largeSpinner}></div>
                        <h3>Redirecting to login...</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.content}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <button onClick={() => navigate('/')} className={styles.backButton}>
                        Back to Expenses
                    </button>
                    <h2 className={styles.title}>Create New Expense</h2>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        <div>
                            <h4>Error</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Expense Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter expense name"
                            disabled={loading}
                            required
                            className={styles.input}
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
                            disabled={loading}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>
                            Category
                        </label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={loading}
                            required
                            className={styles.select}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || loading}
                        className={`${styles.submitButton} ${!isValid || loading ? styles.disabled : ''}`}
                    >
                        {loading ? (
                            <>
                                <div className={styles.spinner}></div>
                                Creating...
                            </>
                        ) : (
                            'Add Expense'
                        )}
                    </button>

                    <div className={styles.formStatus}>
                        {!isValid && (
                            <p className={styles.statusText}>
                                Please fill all fields
                            </p>
                        )}
                        {isValid && !loading && (
                            <p className={styles.statusTextReady}>
                                Ready to create
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateExpense;