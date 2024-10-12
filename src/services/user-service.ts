import axios from 'axios';
import { ILoginData, ISignupData, IUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const signup = async (signupData: ISignupData): Promise<IUser> => {
  const response = await axios.post<IUser>(`${API_BASE_URL}/user/signup`, signupData);
  return response.data;
};

export const login = async (loginData: ILoginData): Promise<IUser> => {
  const response = await axios.post<IUser>(`${API_BASE_URL}/user/login`, loginData);
  return response.data;
};
