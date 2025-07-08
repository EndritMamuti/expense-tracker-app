import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortDropdown, { SortOption } from '../components/SortDropdown';

describe('SortDropdown Component', () => {
    const mockOnSortChange = vi.fn();

    beforeEach(() => {
        mockOnSortChange.mockClear();
    });

    it('renders dropdown with all sort options', () => {
        render(<SortDropdown sortOption="none" onSortChange={mockOnSortChange} />);

        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Sort: None')).toBeInTheDocument();
        expect(screen.getByText('Highest Amount')).toBeInTheDocument();
        expect(screen.getByText('Lowest Amount')).toBeInTheDocument();
        expect(screen.getByText('Latest First')).toBeInTheDocument();
        expect(screen.getByText('Oldest First')).toBeInTheDocument();
    });

    it('displays the current selected sort option', () => {
        render(<SortDropdown sortOption="highest" onSortChange={mockOnSortChange} />);
        expect(screen.getByRole('combobox')).toHaveValue('highest');
    });

    it('calls onSortChange when user selects a different option', async () => {
        render(<SortDropdown sortOption="none" onSortChange={mockOnSortChange} />);
        await userEvent.selectOptions(screen.getByRole('combobox'), 'lowest');
        expect(mockOnSortChange).toHaveBeenCalledWith('lowest');
    });

    it('calls onSortChange with correct type for each option', async () => {
        const sortOptions: SortOption[] = ['none', 'highest', 'lowest', 'latest', 'oldest'];

        for (const option of sortOptions) {
            const { unmount } = render(<SortDropdown sortOption="none" onSortChange={mockOnSortChange} />);
            await userEvent.selectOptions(screen.getByRole('combobox'), option);
            expect(mockOnSortChange).toHaveBeenCalledWith(option);
            unmount();
        }
    });

    it('has correct default option selected', () => {
        render(<SortDropdown sortOption="none" onSortChange={mockOnSortChange} />);
        expect(screen.getByRole('combobox')).toHaveValue('none');
    });

    it('updates selection when sortOption prop changes', () => {
        const { rerender } = render(<SortDropdown sortOption="none" onSortChange={mockOnSortChange} />);
        expect(screen.getByRole('combobox')).toHaveValue('none');

        rerender(<SortDropdown sortOption="highest" onSortChange={mockOnSortChange} />);
        expect(screen.getByRole('combobox')).toHaveValue('highest');
    });
});