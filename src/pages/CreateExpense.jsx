import styles from "../styles/CreateExpense.module.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function CreateExpense() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

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

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError('');

                console.log('Fetching categories from API...');

                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch('http://localhost:8080/api/categories', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && { 'Authorization': `Bearer ${token}` })
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Successfully fetched categories from API:', data);
                        setCategories(data);
                    } else {
                        throw new Error(`API responded with status: ${response.status}`);
                    }
                } catch (apiError) {
                    console.log('API not available, using default categories:', apiError.message);
                    setCategories(mockCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategoriesError('Failed to load categories. Using default categories.');
                setCategories(mockCategories);
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCategories();
        }
    }, [isAuthenticated]);

    const isFormValid = title.trim() && amount && categoryId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setSubmitError('Please fill in all required fields.');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setSubmitError('Please enter a valid amount greater than 0.');
            return;
        }

        setSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const expenseData = {
                title: title.trim(),
                amount: numericAmount,
                categoryId: parseInt(categoryId),
                date: new Date().toISOString().split('T')[0]
            };

            console.log('Submitting expense data:', expenseData);

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:8080/api/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify(expenseData)
                });

                if (response.ok) {
                    const newExpense = await response.json();
                    console.log('Expense created successfully via API:', newExpense);

                    setSubmitSuccess(true);

                    setTitle('');
                    setAmount('');
                    setCategoryId('');

                    alert(`Expense "${expenseData.title}" has been successfully created!`);

                    setTimeout(() => {
                        navigate('/');
                    }, 2000);

                } else {
                    const errorData = await response.text();
                    throw new Error(`API create failed: ${response.status} - ${errorData}`);
                }
            } catch (apiError) {
                console.log('API not available, storing locally:', apiError.message);

                const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
                const newExpense = {
                    id: Date.now(),
                    ...expenseData,
                    category: mockCategories.find(cat => cat.id === parseInt(categoryId))?.name || 'Unknown'
                };
                existingExpenses.push(newExpense);
                localStorage.setItem('expenses', JSON.stringify(existingExpenses));

                console.log('Expense stored locally:', newExpense);

                window.dispatchEvent(new CustomEvent('expenseAdded'));

                setSubmitSuccess(true);

                setTitle('');
                setAmount('');
                setCategoryId('');

                alert(`Expense "${expenseData.title}" has been successfully created!`);

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }

        } catch (error) {
            console.error('Error creating expense:', error);
            setSubmitError(`Failed to create expense: ${error.message || 'Unknown error occurred'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.content}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingContent}>
                        <div className={styles.largeSpinner}></div>
                        <h3>Redirecting to Login</h3>
                        <p>Please log in to access this page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.content}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <button onClick={handleBack} className={styles.backButton} type="button">
                        Back to Expenses
                    </button>
                    <h2 className={styles.title}>Create New Expense</h2>
                </div>

                {submitSuccess && (
                    <div className={styles.successMessage}>
                        <div>
                            <h4>Expense Created Successfully!</h4>
                            <p>Your expense has been added. Redirecting to home page...</p>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className={styles.errorMessage}>
                        <div>
                            <h4>Creation Failed</h4>
                            <p>{submitError}</p>
                        </div>
                    </div>
                )}

                {categoriesError && (
                    <div className={styles.warningMessage}>
                        <p>{categoriesError}</p>
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
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            placeholder="Enter expense name"
                            disabled={submitting}
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
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={styles.input}
                            placeholder="0.00"
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>
                            Category
                        </label>

                        {categoriesLoading ? (
                            <div className={styles.loadingCategories}>
                                <div className={styles.spinner}></div>
                                Loading categories...
                            </div>
                        ) : (
                            <select
                                id="category"
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className={styles.select}
                                disabled={submitting}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || submitting || categoriesLoading}
                        className={`${styles.submitButton} ${
                            (!isFormValid || submitting || categoriesLoading) ? styles.disabled : ''
                        }`}
                    >
                        {submitting ? (
                            <>
                                <div className={styles.spinner}></div>
                                Adding Expense...
                            </>
                        ) : (
                            'Add Expense'
                        )}
                    </button>

                    <div className={styles.formStatus}>
                        {!isFormValid && (
                            <p className={styles.statusText}>
                                Please fill all fields to continue
                            </p>
                        )}
                        {isFormValid && !submitting && (
                            <p className={styles.statusTextReady}>
                                Ready to create expense
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateExpense;