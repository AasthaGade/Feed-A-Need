// Mock API Service for Demo/Development
// This file simulates API responses when no backend is available

import type { User, Donation, ApiResponse } from '../types';

// Mock data storage with passwords
interface MockUser extends User {
  password?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567890',
    address: '123 Admin St, New York, NY',
    role: 'admin',
    type: 'individual',
    registeredAt: new Date().toISOString(),
    password: 'admin123',
  },
  {
    id: '2',
    name: 'John Donor',
    email: 'donor@example.com',
    phone: '+1234567891',
    address: '456 Donor Ave, Los Angeles, CA',
    role: 'donor',
    type: 'individual',
    registeredAt: new Date().toISOString(),
    password: 'donor123',
  },
  {
    id: '3',
    name: 'Sara Recipient',
    email: 'recipient@example.com',
    phone: '+1234567893',
    address: '321 Need St, Houston, TX',
    role: 'recipient',
    type: 'individual',
    registeredAt: new Date().toISOString(),
    password: 'recipient123',
  },
];

const mockDonations: Donation[] = [
  {
    id: '1',
    donor: 'John Donor',
    donorEmail: 'donor@example.com',
    donorPhone: '+1234567891',
    donorAddress: '456 Donor Ave, Los Angeles, CA',
    type: 'food',
    description: 'Fresh vegetables and fruits',
    quantity: '50 kg',
    method: 'pickup',
    location: 'Los Angeles, CA',
    status: 'approved',
    date: new Date(Date.now() - 86400000).toISOString(),
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    donor: 'Jane Smith',
    donorEmail: 'jane@example.com',
    donorPhone: '+1234567892',
    donorAddress: '789 Helper Rd, Chicago, IL',
    type: 'fund',
    description: 'Monthly donation for food bank',
    quantity: '1',
    method: 'online',
    location: 'Online',
    amount: 1000,
    status: 'completed',
    date: new Date(Date.now() - 172800000).toISOString(),
    timestamp: Date.now() - 172800000,
    paymentStatus: 'paid',
  },
  {
    id: '3',
    donor: 'Bob Johnson',
    donorEmail: 'bob@example.com',
    donorPhone: '+1234567893',
    donorAddress: '321 Giving Ln, Miami, FL',
    type: 'food',
    description: 'Canned goods and dry food',
    quantity: '100 items',
    method: 'dropoff',
    location: 'Miami, FL',
    status: 'pending',
    date: new Date().toISOString(),
    timestamp: Date.now(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiService {
  // Auth
  async login(username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(150);

    // Check credentials
    const user = mockUsers.find(
      (u) => (u.email === username || u.name === username) && u.password === password
    );

    if (user) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Math.random(),
        },
      };
    }

    throw new Error('Invalid credentials');
  }

  async register(data: any): Promise<ApiResponse<User>> {
    await delay(200);

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: MockUser = {
      id: String(mockUsers.length + 1),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role,
      type: data.type,
      registeredAt: new Date().toISOString(),
      password: data.password, // Store password for mock API
    };

    mockUsers.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(0);

    // Get token from localStorage and find corresponding user
    // Get stored user data from localStorage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const user = mockUsers.find((u) => u.email === userData.email);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return {
          success: true,
          data: userWithoutPassword,
        };
      }
    }

    throw new Error('Not authenticated');
  }

  // Donations
  async getDonations(): Promise<ApiResponse<Donation[]>> {
    await delay(80);

    return {
      success: true,
      data: [...mockDonations].sort((a, b) => b.timestamp - a.timestamp),
    };
  }

  async createDonation(data: any): Promise<ApiResponse<Donation>> {
    await delay(80);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const newDonation: Donation = {
      id: String(mockDonations.length + 1),
      donor: user.name || 'Anonymous',
      donorEmail: user.email || '',
      donorPhone: user.phone || '',
      donorAddress: user.address || '',
      type: data.type,
      description: data.description,
      quantity: data.quantity,
      method: data.method,
      location: data.location,
      amount: data.amount,
      status: 'pending',
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    mockDonations.unshift(newDonation);

    return {
      success: true,
      data: newDonation,
    };
  }

  async updateDonation(id: string, data: Partial<Donation>): Promise<ApiResponse<Donation>> {
    await delay(80);

    const index = mockDonations.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDonations[index] = { ...mockDonations[index], ...data };
      return {
        success: true,
        data: mockDonations[index],
      };
    }

    throw new Error('Donation not found');
  }

  async approveDonation(id: string): Promise<ApiResponse<Donation>> {
    await delay(80);

    const index = mockDonations.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDonations[index].status = 'approved';
      mockDonations[index].approvedDate = new Date().toISOString();
      return {
        success: true,
        data: mockDonations[index],
      };
    }

    throw new Error('Donation not found');
  }

  async completeDonation(id: string): Promise<ApiResponse<Donation>> {
    await delay(80);

    const index = mockDonations.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDonations[index].status = 'completed';
      mockDonations[index].completedDate = new Date().toISOString();
      return {
        success: true,
        data: mockDonations[index],
      };
    }

    throw new Error('Donation not found');
  }

  async deleteDonation(id: string): Promise<ApiResponse<void>> {
    await delay(80);

    const index = mockDonations.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDonations.splice(index, 1);
      return {
        success: true,
      };
    }

    throw new Error('Donation not found');
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(80);

    // Remove passwords from response
    const usersWithoutPasswords = mockUsers.map(({ password: _, ...user }) => user);
    return {
      success: true,
      data: usersWithoutPasswords,
    };
  }

  // Stats
  async getStats(): Promise<ApiResponse<any>> {
    await delay(0);

    return {
      success: true,
      data: {
        totalDonations: mockDonations.length,
        pending: mockDonations.filter((d) => d.status === 'pending').length,
        approved: mockDonations.filter((d) => d.status === 'approved').length,
        completed: mockDonations.filter((d) => d.status === 'completed').length,
      },
    };
  }
}

// Export singleton instance
export const mockApi = new MockApiService();
