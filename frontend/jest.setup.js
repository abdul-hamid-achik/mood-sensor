import '@testing-library/jest-dom/extend-expect'

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next-auth/react', () => {
    return {
        ...jest.requireActual('next-auth/react'),
        useSession: () => ({user: null, status: 'loading'})
    }
});