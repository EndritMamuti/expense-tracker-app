module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx'
            }
        }],
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: [
        '<rootDir>/src/**/*.test.(ts|tsx|js|jsx)',
        '<rootDir>/src/**/tests/*.test.(ts|tsx|js|jsx)'
    ]
};