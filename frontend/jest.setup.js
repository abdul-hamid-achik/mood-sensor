import '@testing-library/jest-dom/extend-expect'

jest.mock('next/router', () => require('next-router-mock'));

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
}));
