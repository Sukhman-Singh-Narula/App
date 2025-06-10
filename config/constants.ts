// File: config/constants.ts
export const API_BASE_URL = 'http://0.0.0.0:8000'; // Development server
    

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    TOKEN_EXPIRY: 'tokenExpiry',
    USER_PROFILE: 'userProfile',
} as const;

export const TOKEN_EXPIRY_DAYS = 30;
export const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
