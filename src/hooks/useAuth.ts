// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { login, signup } from '../services'; // Assuming these are your services for login/signup
import { IUser, ILoginData, ISignupData } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user and token from session storage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login user and save data to session storage
  const loginUser = async (loginData: ILoginData): Promise<IUser | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await login(loginData); // login returns user data with token
      console.log(userData)
      if (userData.token) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', userData?.token); // Assuming userData contains the token
        setUser(userData);
      }
      return userData;
    } catch (err: unknown) { // safer to use `unknown` here
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during login');
      } else {
        setError('An unknown error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup user and save data to session storage
  const signupUser = async (signupData: ISignupData): Promise<IUser | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await signup(signupData); // signup returns user data with token
      if (userData.token) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', userData?.token); // Assuming userData contains the token
        setUser(userData);
      }
      return userData;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during signup');
      } else {
        setError('An unknown error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout user and clear session storage
  const logoutUser = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, error, loginUser, signupUser, logoutUser };
};
