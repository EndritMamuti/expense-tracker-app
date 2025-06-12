import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/UpdateExpense.module.css';

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

const sampleExpenses = [
    { id: 1, title: "Groceries", category: "Food", categoryId: 1, amount: 78.45, date: "2025-05-12" },
    { id: 2, title: "Rent", category: "Housing", categoryId: 2, amount: 600.00, date: "2025-05-01" },
    { id: 3, title: "Dinner Out", category: "Entertainment", categoryId: 4, amount: 56.20, date: "2025-05-14" },
    { id: 4, title: "Electric Bill", category: "Utilities", categoryId: 5, amount: 94.73, date: "2025-05-10" }
];

function UpdateExpense() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();

    const expenseId = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        categoryId: '',
        date: ''
    });

    const [categories, setCategories] = useState([]);
    const [originalExpense, setOriginalExpense] = useState(null);

    const [pageLoading, setPageLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [pageError, setPageError] = useState('');
    const [categoriesError, setCategoriesError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!expenseId) {
            navigate('/', { replace: true });
            return;
        }
    }, [isAuthenticated, expenseId, navigate]);

    useEffect(() => {
        const fetchExpenseDetails = async () => {
            if (!expenseId || !isAuthenticated) return;

            try {
                setPageLoading(true);
                setPageError('');

                console.log(`Loading expense details for ID: ${expenseId}`);

                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && { 'Authorization': `Bearer ${token}` })
                        }
                    });

                    if (response.ok) {
                        const expenseData = await response.json();
                        console.log('Expense loaded from API:', expenseData);

                        setOriginalExpense(expenseData);
                        setFormData({
                            title: expenseData.title || '',
                            amount: expenseData.amount?.toString() || '',
                            categoryId: expenseData.categoryId?.toString() || '',
                            date: expenseData.date || ''
                        });
                        return;
                    } else {
                        throw new Error(`API request failed with status: ${response.status}`);
                    }
                } catch (apiError) {
                    console.log('API unavailable, checking local storage:', apiError.message);

                    const localExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
                    const localExpense = localExpenses.find(exp => exp.id.toString() === expenseId.toString());

                    if (localExpense) {
                        console.log('Found expense in local storage:', localExpense);
                        setOriginalExpense(localExpense);
                        setFormData({
                            title: localExpense.title || '',
                            amount: localExpense.amount?.toString() || '',
                            categoryId: localExpense.categoryId?.toString() || '',
                            date: localExpense.date || ''
                        });
                        return;
                    }

                    const sampleExpense = sampleExpenses.find(exp => exp.id.toString() === expenseId.toString());
                    if (sampleExpense) {
                        console.log('Using sample expense data:', sampleExpense);
                        setOriginalExpense(sampleExpense);
                        setFormData({
                            title: sampleExpense.title || '',
                            amount: sampleExpense.amount?.toString() || '',
                            categoryId: sampleExpense.categoryId?.toString() || '',
                            date: sampleExpense.date || ''
                        });
                        return;
                    }

                    throw new Error('Expense not found');
                }
            } catch (error) {
                console.error('Failed to load expense details:', error);
                setPageError(`Could not load expense details: ${error.message}`);
            } finally {
                setPageLoading(false);
            }
        };

        fetchExpenseDetails();
    }, [expenseId, isAuthenticated]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError('');

                console.log('Loading categories...');

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
                        console.log('Categories loaded from API:', data);
                        setCategories(data);
                        return;
                    } else {
                        throw new Error('API not available');
                    }
                } catch (apiError) {
                    console.log('API unavailable, using default categories:', apiError.message);
                    setCategories(mockCategories);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                setCategoriesError('Could not load categories. Using default options.');
                setCategories(mockCategories);
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCategories();
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (submitError) {
            setSubmitError('');
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.title.trim()) {
            errors.push('Title is required');
        }

        if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
            errors.push('Valid amount is required');
        }

        if (!formData.categoryId) {
            errors.push('Category is required');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setSubmitError(`Please fix these errors:\n${validationErrors.join('\n')}`);
            return;
        }

        setSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const updatedExpense = {
                id: parseInt(expenseId),
                title: formData.title.trim(),
                amount: parseFloat(formData.amount),
                categoryId: parseInt(formData.categoryId),
                date: formData.date || new Date().toISOString().split('T')[0]
            };

            console.log('Updating expense:', updatedExpense);

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify(updatedExpense)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Expense updated via API:', responseData);
                } else {
                    const errorData = await response.text();
                    throw new Error(`API update failed: ${response.status} - ${errorData}`);
                }
            } catch (apiError) {
                console.log('API update failed, updating local storage:', apiError.message);

                const localExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
                const updatedLocalExpenses = localExpenses.map(exp =>
                    exp.id.toString() === expenseId.toString()
                        ? { ...updatedExpense, category: categories.find(cat => cat.id === updatedExpense.categoryId)?.name || 'Unknown' }
                        : exp
                );
                localStorage.setItem('expenses', JSON.stringify(updatedLocalExpenses));
                console.log('Updated expense in local storage');
            }

            setSubmitSuccess(true);
            alert(`Expense "${updatedExpense.title}" has been updated successfully!`);

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1500);

        } catch (error) {
            console.error('Error updating expense:', error);
            setSubmitError(`Failed to update expense: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate('/', { replace: true });
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (!expenseId) {
        return (
            <div className={styles.container}>
                <div className={styles.errorPage}>
                    <h2>Invalid Request</h2>
                    <p>No expense ID provided. Please select an expense to edit.</p>
                    <button onClick={() => navigate('/')} className={styles.backButton}>
                        Back to Expenses
                    </button>
                </div>
            </div>
        );
    }

    if (pageLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingContent}>
                        <div className={styles.largeSpinner}></div>
                        <h3>Loading Expense Details</h3>
                        <p>Please wait while we load the expense information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (pageError) {
        return (
            <div className={styles.container}>
                <div className={styles.errorPage}>
                    <h2>Error Loading Expense</h2>
                    <p>{pageError}</p>
                    <div className={styles.errorActions}>
                        <button onClick={() => window.location.reload()} className={styles.retryButton}>
                            Retry
                        </button>
                        <button onClick={() => navigate('/')} className={styles.backButton}>
                            Back to Expenses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                {submitSuccess && (
                    <div className={styles.successMessage}>
                        <div>
                            <h4>Success!</h4>
                            <p>Expense updated successfully. Redirecting to home page...</p>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className={styles.errorMessage}>
                        <div>
                            <h4>Update Failed</h4>
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
                    <div className={styles.formHeader}>
                        <button onClick={handleCancel} className={styles.backButton} type="button">
                            Back to Expenses
                        </button>
                        <h2>Expense Details</h2>
                        {originalExpense && (
                            <p className={styles.originalInfo}>
                                Currently: "{originalExpense.title}" - {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(originalExpense.amount)}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Expense Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Enter expense title"
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amount" className={styles.label}>
                            Amount
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={formData.amount}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="0.00"
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="categoryId" className={styles.label}>
                            Category
                        </label>
                        {categoriesLoading ? (
                            <div className={styles.loadingCategories}>
                                <div className={styles.spinner}></div>
                                Loading categories...
                            </div>
                        ) : (
                            <select
                                id="categoryId"
                                name="categoryId"
                                required
                                value={formData.categoryId}
                                onChange={handleInputChange}
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

                    <div className={styles.formGroup}>
                        <label htmlFor="date" className={styles.label}>
                            Date
                        </label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={styles.input}
                            disabled={submitting}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || categoriesLoading || !formData.title.trim() || !formData.amount || !formData.categoryId}
                            className={`${styles.submitButton} ${
                                (submitting || categoriesLoading || !formData.title.trim() || !formData.amount || !formData.categoryId)
                                    ? styles.disabled
                                    : ''
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Updating Expense...
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