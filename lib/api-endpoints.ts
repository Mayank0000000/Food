import { ENV } from '@/config/env';

// API Endpoints configuration
export const API_ENDPOINTS = {
  // GitHub API base
  GITHUB: {
    BASE: ENV.GITHUB_API_BASE_URL,
    REPO: `/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}`,
  },

  // File paths
  FILES: {
    USERS: ENV.USERS_FILE_PATH || 'data/users.json',
    MENU: ENV.MENU_FILE_PATH || 'data/menu.json',
    CART: ENV.CART_FILE_PATH || 'data/cart.json',
    ORDERS: ENV.ORDERS_FILE_PATH || 'data/orders.json',
    BANNERS: ENV.BANNERS_FILE_PATH || 'data/banners.json',
    BOOKINGS: ENV.BOOKINGS_FILE_PATH || 'data/bookings.json',
    DINE: ENV.DINE_FILE_PATH || 'data/dine.json',
    NOTIFICATIONS: ENV.NOTIFICATIONS_FILE_PATH || 'data/notifications.json',
    FEEDBACK: ENV.FEEDBACK_FILE_PATH || 'data/feedback.json',
    // Language files
    LANGUAGES: {
      ENGLISH: 'data/english.json',
      HINDI: 'data/hindi.json',
      KANNADA: 'data/kannada.json',
      TELUGU: 'data/telugu.json',
    },
  },

  // Direct endpoints
  USERS: ENV.USERS_FILE_PATH || 'data/users.json',
  MENU: ENV.MENU_FILE_PATH || 'data/menu.json',
  CART: ENV.CART_FILE_PATH || 'data/cart.json',
  ORDERS: ENV.ORDERS_FILE_PATH || 'data/orders.json',
  BANNERS: ENV.BANNERS_FILE_PATH || 'data/banners.json',
  BOOKINGS: ENV.BOOKINGS_FILE_PATH || 'data/bookings.json',
  DINE: ENV.DINE_FILE_PATH || 'data/dine.json',
  NOTIFICATIONS: ENV.NOTIFICATIONS_FILE_PATH || 'data/notifications.json',

  // GitHub file operations
  getFileUrl: (filePath: string) => 
    `/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/contents/${filePath}`,
} as const;

// API Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;