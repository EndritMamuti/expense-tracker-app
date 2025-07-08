import React from 'react';
import styles from '../styles/SortDropdown.module.css';

export type SortOption = 'none' | 'highest' | 'lowest' | 'latest' | 'oldest';

interface SortDropdownProps {
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortOption, onSortChange }) => {
    return (
        <div className={styles.sortContainer}>
            <select
                className={styles.sortSelect}
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                data-testid="sort-dropdown"
            >
                <option value="none">Sort: None</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
            </select>
        </div>
    );
};

export default SortDropdown;