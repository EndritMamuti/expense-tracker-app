import React from 'react';
import styles from '../styles/Search.module.css';

interface SearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search expenses by title..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="search-input"
            />
        </div>
    );
};

export default Search;