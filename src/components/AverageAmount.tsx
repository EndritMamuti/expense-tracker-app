import React from 'react';
import styles from '../styles/AverageAmount.module.css';

interface Expense {
    id: number | string;
    title: string;
    amount?: number | string;
    value?: number | string;
    date?: string;
}

interface AverageAmountProps {
    expenses: Expense[];
}

const AverageAmount: React.FC<AverageAmountProps> = ({ expenses }) => {
    const calculateAverage = (): number => {
        if (expenses.length === 0) return 0;

        const total = expenses.reduce((sum, expense) => {
            const amountValue = expense.amount || expense.value || 0;
            const numericAmount = typeof amountValue === 'string'
                ? parseFloat(amountValue) || 0
                : amountValue || 0;

            return sum + numericAmount;
        }, 0);

        return total / expenses.length;
    };

    const average = calculateAverage();

    return (
        <div className={styles.averageContainer}>
            <div className={styles.averageLabel} data-testid="average-amount">
                Average Amount: ${average.toFixed(2)}
            </div>
        </div>
    );
};

export default AverageAmount;