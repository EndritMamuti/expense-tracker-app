import '@testing-library/jest-dom';

// Mock CSS modules
Object.defineProperty(require.cache, 'css', {
    get() {
        return () => ({});
    }
});

// Mock window.confirm for testing
global.confirm = jest.fn(() => true);

// Mock window.alert for testing
global.alert = jest.fn();