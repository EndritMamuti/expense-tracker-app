import { render, screen } from '@testing-library/react';
import AverageAmount from '../components/AverageAmount';

describe('AverageAmount Component', () => {
    it('displays $0.00 when no expenses are provided', () => {
        render(<AverageAmount expenses={[]} />);
        expect(screen.getByText('Average Amount: $0.00')).toBeInTheDocument();
    });

    it('calculates correct average with amount property', () => {
        const expenses = [
            { id: 1, title: 'Coffee', amount: 5.5 },
            { id: 2, title: 'Lunch', amount: 12 },
            { id: 3, title: 'Gas', amount: 45 }
        ];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $20.83')).toBeInTheDocument();
    });

    it('calculates correct average with value property', () => {
        const expenses = [
            { id: 1, title: 'Coffee', value: 4.25 },
            { id: 2, title: 'Lunch', value: 15.75 }
        ];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $10.00')).toBeInTheDocument();
    });

    it('handles mixed amount and value properties', () => {
        const expenses = [
            { id: 1, title: 'Coffee', amount: 5 },
            { id: 2, title: 'Lunch', value: 10 },
            { id: 3, title: 'Gas', amount: 30 }
        ];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $15.00')).toBeInTheDocument();
    });

    it('treats missing amount/value as 0', () => {
        const expenses = [
            { id: 1, title: 'Free Coffee' },
            { id: 2, title: 'Lunch', amount: 10 }
        ];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $5.00')).toBeInTheDocument();
    });

    it('formats decimal places correctly', () => {
        const expenses = [
            { id: 1, title: 'Item 1', amount: 10 },
            { id: 2, title: 'Item 2', amount: 20 },
            { id: 3, title: 'Item 3', amount: 25 }
        ];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $18.33')).toBeInTheDocument();
    });

    it('handles single expense correctly', () => {
        const expenses = [{ id: 1, title: 'Single Item', amount: 42.99 }];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $42.99')).toBeInTheDocument();
    });

    it('prioritizes amount over value when both exist', () => {
        const expenses = [{ id: 1, title: 'Item', amount: 100, value: 50 }];
        render(<AverageAmount expenses={expenses} />);
        expect(screen.getByText('Average Amount: $100.00')).toBeInTheDocument();
    });
});