import { AxiosResponse } from 'axios';
import axiosInstance from '@api/axiosInstance';
import { AuthResponse } from '@redux/sagas/auth/authTypes';

export const registerApi = (uniqueID: string): Promise<AxiosResponse<AuthResponse>> =>
  axiosInstance(null).post<AuthResponse>('/auth/register', { uniqueID });

export const loginApi = (uniqueID: string): Promise<AxiosResponse<AuthResponse>> =>
  axiosInstance(null).post<AuthResponse>('/auth/login', { uniqueID });
