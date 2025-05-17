// Backend API URLs
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  PROFILE: `${API_URL}/auth/profile`,
};

// Task endpoints
export const TASK_ENDPOINTS = {
  BASE: `${API_URL}/tasks`,
  DETAIL: (id: string) => `${API_URL}/tasks/${id}`,
};

// Project endpoints
export const PROJECT_ENDPOINTS = {
  BASE: `${API_URL}/projects`,
  DETAIL: (id: string) => `${API_URL}/projects/${id}`,
};

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  BASE: `${API_URL}/notifications`,
  MARK_READ: (id: string) => `${API_URL}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_URL}/notifications/read-all`,
  DELETE_ALL: `${API_URL}/notifications/all`,
}; 