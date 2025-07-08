import '@testing-library/jest-dom';

Object.defineProperty(require.cache, 'css', {
    get() {
        return () => ({});
    }
});

global.confirm = jest.fn(() => true);

global.alert = jest.fn();