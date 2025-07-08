import { render, screen, fireEvent } from '@testing-library/react';
import SortDropdown, { SortOption } from '../components/SortDropdown';

describe('SortDropdown Component', () => {
    const mockOnSortChange = vi.fn();

    beforeEach(() => {
        mockOnSortChange.mockClear();
    });

    it('renders dropdown with all sort options', () => {
        render(
            <SortDropdown
                sortOption="none"
                onSortChange={mockOnSortChange}
            />
        );

        const dropdown = screen.getByTestId('sort-dropdown');
        expect(dropdown).toBeInTheDocument();

        // Check all options exist
        expect(screen.getByText('Sort: None')).toBeInTheDocument();
        expect(screen.getByText('Highest Amount')).toBeInTheDocument();
        expect(screen.getByText('Lowest Amount')).toBeInTheDocument();
        expect(screen.getByText('Latest First')).toBeInTheDocument();
        expect(screen.getByText('Oldest First')).toBeInTheDocument();
    });

    it('displays the current selected sort option', () => {
        render(
            <SortDropdown
                sortOption="highest"
                onSortChange={mockOnSortChange}
            />
        );

        const dropdown = screen.getByTestId('sort-dropdown');
        expect(dropdown).toHaveValue('highest');
    });

    it('calls onSortChange when user selects a different option', () => {
        render(
            <SortDropdown
                sortOption="none"
                onSortChange={mockOnSortChange}
            />
        );

        const dropdown = screen.getByTestId('sort-dropdown');
        fireEvent.change(dropdown, { target: { value: 'lowest' } });

        expect(mockOnSortChange).toHaveBeenCalledTimes(1);
        expect(mockOnSortChange).toHaveBeenCalledWith('lowest');
    });

    it('calls onSortChange with correct type for each option', () => {
        const sortOptions: SortOption[] = ['none', 'highest', 'lowest', 'latest', 'oldest'];

        sortOptions.forEach((option) => {
            mockOnSortChange.mockClear();

            const { unmount } = render(
                <SortDropdown
                    sortOption="none"
                    onSortChange={mockOnSortChange}
                />
            );

            const dropdown = screen.getByTestId('sort-dropdown');
            fireEvent.change(dropdown, { target: { value: option } });

            expect(mockOnSortChange).toHaveBeenCalledWith(option);
            unmount();
        });
    });

    it('has correct default option selected', () => {
        render(
            <SortDropdown
                sortOption="none"
                onSortChange={mockOnSortChange}
            />
        );

        const dropdown = screen.getByTestId('sort-dropdown');
        expect(dropdown).toHaveValue('none');
    });

    it('updates selection when sortOption prop changes', () => {
        const { rerender } = render(
            <SortDropdown
                sortOption="none"
                onSortChange={mockOnSortChange}
            />
        );

        let dropdown = screen.getByTestId('sort-dropdown');
        expect(dropdown).toHaveValue('none');

        rerender(
            <SortDropdown
                sortOption="highest"
                onSortChange={mockOnSortChange}
            />
        );

        dropdown = screen.getByTestId('sort-dropdown');
        expect(dropdown).toHaveValue('highest');
    });
});