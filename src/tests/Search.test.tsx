import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Search from '../components/Search';

const ControlledSearch = ({
                              initialValue = '',
                              onSearchChange,
                          }: {
    initialValue?: string;
    onSearchChange: (val: string) => void;
}) => {
    const [value, setValue] = useState(initialValue);

    return (
        <Search
            searchTerm={value}
            onSearchChange={(val) => {
                setValue(val);
                onSearchChange(val);
            }}
        />
    );
};

describe('Search Component', () => {
    const renderControlled = (initialValue = '') => {
        const mockHandler = vi.fn();
        render(<ControlledSearch initialValue={initialValue} onSearchChange={mockHandler} />);
        return mockHandler;
    };

    it('renders search input with correct placeholder', () => {
        renderControlled();
        expect(screen.getByPlaceholderText('Search expenses by title...')).toBeInTheDocument();
    });

    it('displays the current search term value', () => {
        renderControlled('coffee');
        expect(screen.getByRole('textbox')).toHaveValue('coffee');
    });

    it('calls onSearchChange when user types in the input', async () => {
        const handler = renderControlled('');
        const input = screen.getByRole('textbox');

        await act(async () => {
            await userEvent.type(input, 'grocery');
        });

        expect(handler).toHaveBeenCalledTimes(7);
        expect(handler).toHaveBeenLastCalledWith('grocery');
    });

    it('calls onSearchChange when user clears the input', async () => {
        const handler = renderControlled('existing search');
        const input = screen.getByRole('textbox');

        await act(async () => {
            await userEvent.clear(input);
        });

        expect(handler).toHaveBeenLastCalledWith('');
    });

    it('has correct input type', () => {
        renderControlled();
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text');
    });
});