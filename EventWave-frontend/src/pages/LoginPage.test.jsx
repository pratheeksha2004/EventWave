// In src/pages/LoginPage.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LoginPage from './LoginPage';
import * as authService from '../api/authService';

// Mock the react-router-dom navigate function
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock the authService module
vi.mock('../api/authService');

// Mock jwt-decode to control its output
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

// Import jwt-decode AFTER the mock is set up
import { jwtDecode } from 'jwt-decode';

describe('LoginPage Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form with all necessary fields', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByRole('heading', { name: /login to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should allow user to type into username and password fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: BrowserRouter });
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  // --- THIS IS THE CORRECTED TEST CASE ---
  it('should call the login service and navigate on successful submission', async () => {
    const user = userEvent.setup();
    
    // Arrange:
    // 1. Mock what the `login` API call will return. It returns the raw token string.
    const fakeToken = "a-valid-looking-fake-token";
    authService.login.mockResolvedValue(fakeToken);

    // 2. Mock what `jwtDecode` will return when it's called with our fake token.
    // This is the key fix. We control the decoded payload.
    jwtDecode.mockReturnValue({ role: 'USER', sub: 'testuser' });
    
    render(<LoginPage />, { wrapper: BrowserRouter });
    
    // Act:
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert:
    await waitFor(() => {
      // Check that the login API was called correctly.
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      
      // Check that the token was decoded.
      expect(jwtDecode).toHaveBeenCalledWith(fakeToken);

      // Check that the user was redirected to the correct dashboard.
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Also assert that the error message is NOT visible.
    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });
});