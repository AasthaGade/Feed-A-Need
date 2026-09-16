import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, User, Donation, Request, LoginCredentials, RegisterData, DonationFormData } from '../types';
import { mockApi } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_URL;

class ApiService {
  private api: AxiosInstance;
  private useMock: boolean;

  constructor() {
    this.useMock = USE_MOCK_API;
    
    if (this.useMock) {
      console.log('🎭 Using Mock API for development');
    }

    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    if (this.useMock) {
      return mockApi.login(credentials.username, credentials.password);
    }
    
    try {
      const response = await this.api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    if (this.useMock) {
      return mockApi.register(data);
    }
    
    try {
      const response = await this.api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (this.useMock) {
      return mockApi.getCurrentUser();
    }
    
    try {
      const response = await this.api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Donation endpoints
  async getDonations(): Promise<ApiResponse<Donation[]>> {
    if (this.useMock) {
      return mockApi.getDonations();
    }
    
    try {
      const response = await this.api.get('/donations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDonationById(id: string): Promise<ApiResponse<Donation>> {
    try {
      const response = await this.api.get(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDonation(data: DonationFormData): Promise<ApiResponse<Donation>> {
    if (this.useMock) {
      return mockApi.createDonation(data);
    }
    
    try {
      const response = await this.api.post('/donations', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDonation(id: string, data: Partial<Donation>): Promise<ApiResponse<Donation>> {
    if (this.useMock) {
      return mockApi.updateDonation(id, data);
    }
    
    try {
      const response = await this.api.put(`/donations/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDonation(id: string): Promise<ApiResponse<void>> {
    if (this.useMock) {
      return mockApi.deleteDonation(id);
    }
    
    try {
      const response = await this.api.delete(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveDonation(id: string): Promise<ApiResponse<Donation>> {
    if (this.useMock) {
      return mockApi.approveDonation(id);
    }
    
    try {
      const response = await this.api.post(`/donations/${id}/approve`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeDonation(id: string): Promise<ApiResponse<Donation>> {
    if (this.useMock) {
      return mockApi.completeDonation(id);
    }
    
    try {
      const response = await this.api.post(`/donations/${id}/complete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request endpoints
  async getRequests(): Promise<ApiResponse<Request[]>> {
    try {
      const response = await this.api.get('/requests');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createRequest(donationId: string, notes?: string): Promise<ApiResponse<Request>> {
    try {
      const response = await this.api.post('/requests', { donationId, notes });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    if (this.useMock) {
      return mockApi.getUsers();
    }
    
    try {
      const response = await this.api.get('/users');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Stats endpoint
  async getStats(): Promise<ApiResponse<any>> {
    if (this.useMock) {
      return mockApi.getStats();
    }
    
    try {
      const response = await this.api.get('/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export default new ApiService();
