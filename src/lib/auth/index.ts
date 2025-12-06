/**
 * Auth token management utilities.
 * Uses localStorage for token storage (can be easily switched to cookies).
 */

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

export interface TokenData {
  token: string;
  userId?: number | string;
}

/**
 * Get the stored JWT token from localStorage.
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Set the JWT token in localStorage.
 */
export const setToken = (token: string, userId?: number | string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (userId) {
      localStorage.setItem(USER_ID_KEY, String(userId));
    }
  } catch (error) {
    console.error('Failed to set token:', error);
  }
};

/**
 * Remove the JWT token from localStorage.
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

/**
 * Get the Authorization header value (Bearer token).
 */
export const getAuthHeader = (): string | null => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Check if user is authenticated.
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Get stored user ID.
 */
export const getUserId = (): string | null => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Failed to get user ID:', error);
    return null;
  }
};

/**
 * Clear all auth data (logout).
 */
export const clearAuth = (): void => {
  removeToken();
};
