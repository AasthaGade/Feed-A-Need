export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'donor' | 'recipient';
  type?: 'ngo' | 'individual';
  registeredAt: string;
  avatar?: string;
}

export interface Donation {
  id: string;
  donor: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
  type: 'food' | 'fund';
  description: string;
  quantity: string;
  method: 'pickup' | 'dropoff' | 'delivery' | 'online';
  location: string;
  locationCoords?: { lat: number; lng: number };
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  date: string;
  timestamp: number;
  paymentId?: string;
  amount?: number;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  invoiceNumber?: string;
  invoiceHTML?: string;
  approvedDate?: string;
  completedDate?: string;
  rejectionReason?: string;
}

export interface Request {
  id: string;
  donationId: string;
  recipient: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  status: 'requested' | 'approved' | 'completed' | 'rejected';
  date: string;
  timestamp: number;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  role: 'donor' | 'recipient';
  type?: 'ngo' | 'individual';
}

export interface DonationFormData {
  type: 'food' | 'fund';
  description: string;
  quantity: string;
  method: 'pickup' | 'dropoff' | 'delivery' | 'online';
  location: string;
  amount?: number;
  fundTitle?: string;
  fundCategory?: string;
  recipientOrg?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface Stats {
  totalDonations: number;
  pending: number;
  approved: number;
  completed: number;
  totalAmount?: number;
  totalBeneficiaries?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
