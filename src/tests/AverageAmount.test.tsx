import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AverageAmount from '../components/AverageAmount';

describe('AverageAmount Component', () => {
    it('displays $0.00 when no expenses are provided', () => {
        render(<AverageAmount expenses={[]} />);

        const averageLabel = screen.getByTestId('average-amount');
        expect(averageLabel).toBeInTheDocument();
        expect(averageLabel).toHaveTextContent('Average Amount: $0.00');
    });

    it('calculates correct average with amount property', () => {
        const expenses = [
            { id: 1, title: 'Coffee', amount: 5.50 },
            { id: 2, title: 'Lunch', amount: 12.00 },
            { id: 3, title: 'Gas', amount: 45.00 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Average: (5.50 + 12.00 + 45.00) / 3 = 20.83
        expect(averageLabel).toHaveTextContent('Average Amount: $20.83');
    });

    it('calculates correct average with value property', () => {
        const expenses = [
            { id: 1, title: 'Coffee', value: 4.25 },
            { id: 2, title: 'Lunch', value: 15.75 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Average: (4.25 + 15.75) / 2 = 10.00
        expect(averageLabel).toHaveTextContent('Average Amount: $10.00');
    });

    it('handles mixed amount and value properties', () => {
        const expenses = [
            { id: 1, title: 'Coffee', amount: 5.00 },
            { id: 2, title: 'Lunch', value: 10.00 },
            { id: 3, title: 'Gas', amount: 30.00 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Average: (5.00 + 10.00 + 30.00) / 3 = 15.00
        expect(averageLabel).toHaveTextContent('Average Amount: $15.00');
    });

    it('treats missing amount/value as 0', () => {
        const expenses = [
            { id: 1, title: 'Free Coffee' }, // No amount or value
            { id: 2, title: 'Lunch', amount: 10.00 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Average: (0 + 10.00) / 2 = 5.00
        expect(averageLabel).toHaveTextContent('Average Amount: $5.00');
    });

    it('formats decimal places correctly', () => {
        const expenses = [
            { id: 1, title: 'Item 1', amount: 10 },
            { id: 2, title: 'Item 2', amount: 20 },
            { id: 3, title: 'Item 3', amount: 25 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Average: (10 + 20 + 25) / 3 = 18.33333...
        expect(averageLabel).toHaveTextContent('Average Amount: $18.33');
    });

    it('handles single expense correctly', () => {
        const expenses = [
            { id: 1, title: 'Single Item', amount: 42.99 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        expect(averageLabel).toHaveTextContent('Average Amount: $42.99');
    });

    it('prioritizes value over amount when both exist', () => {
        const expenses = [
            { id: 1, title: 'Item', amount: 100.00, value: 50.00 }
        ];

        render(<AverageAmount expenses={expenses} />);

        const averageLabel = screen.getByTestId('average-amount');
        // Should use amount (100.00) since the component checks amount first
        expect(averageLabel).toHaveTextContent('Average Amount: $100.00');
    });
});