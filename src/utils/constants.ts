export const APP_NAME = 'Feed a Need';

export const DONATION_TYPES = {
  FOOD: 'food',
  FUND: 'fund',
} as const;

export const DONATION_METHODS = {
  PICKUP: 'pickup',
  DROPOFF: 'dropoff',
  ONLINE: 'online',
} as const;

export const DONATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const REQUEST_STATUS = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  RECIPIENT: 'recipient',
} as const;

export const USER_TYPES = {
  NGO: 'ngo',
  INDIVIDUAL: 'individual',
} as const;

export const STATUS_COLORS = {
  pending: 'yellow',
  approved: 'green',
  completed: 'gray',
  cancelled: 'red',
  requested: 'blue',
  rejected: 'red',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DONATIONS: '/dashboard/donations',
  ANALYTICS: '/dashboard/analytics',
  USERS: '/dashboard/users',
  PROFILE: '/dashboard/profile',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  DONATIONS: '/donations',
  REQUESTS: '/requests',
  USERS: '/users',
  STATS: '/stats',
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
} as const;

export const TOAST_DURATION = 3000;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;
