import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../components/Search';

describe('Search Component', () => {
    const mockOnSearchChange = vi.fn();

    beforeEach(() => {
        mockOnSearchChange.mockClear();
    });

    it('renders search input with correct placeholder', () => {
        render(
            <Search
                searchTerm=""
                onSearchChange={mockOnSearchChange}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('placeholder', 'Search expenses by title...');
    });

    it('displays the current search term value', () => {
        const searchTerm = 'coffee';
        render(
            <Search
                searchTerm={searchTerm}
                onSearchChange={mockOnSearchChange}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toHaveValue(searchTerm);
    });

    it('calls onSearchChange when user types in the input', () => {
        render(
            <Search
                searchTerm=""
                onSearchChange={mockOnSearchChange}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'grocery' } });

        expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
        expect(mockOnSearchChange).toHaveBeenCalledWith('grocery');
    });

    it('calls onSearchChange when user clears the input', () => {
        render(
            <Search
                searchTerm="existing search"
                onSearchChange={mockOnSearchChange}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '' } });

        expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
        expect(mockOnSearchChange).toHaveBeenCalledWith('');
    });

    it('has correct input type', () => {
        render(
            <Search
                searchTerm=""
                onSearchChange={mockOnSearchChange}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toHaveAttribute('type', 'text');
    });
});