'use client';

// Check if user is logged in (using cookies)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Try to get role from cookie first (non-HTTP-only)
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('user_role='));
  
  return !!tokenCookie;
}

// Get current user from localStorage (we still store user info there)
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}

// No longer need to get token from localStorage
export function getToken(): string | null {
  // Token is now HTTP-only, not accessible from client
  return null;
}

// Enhanced logout with API call
export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Call logout API to clear cookies
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
  }
  
  // Clear localStorage
  localStorage.removeItem('user');
  
  // Redirect to login
   window.location.href = '/auth/signin';
}

// API request with credentials (cookies are sent automatically)
export async function authFetch(url: string, options: RequestInit = {}) {
  console.log(`🔗 Fetching: ${url}`);
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Send cookies automatically
  });

  console.log(`📥 Response for ${url}:`, response.status);
  
  if (response.status === 401) {
    console.warn('⚠️ 401 Unauthorized - logging out');
    await logout();
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    console.error(`❌ Fetch error for ${url}:`, response.status, response.statusText);
  }

  return response;
}

export function hasRole(requiredRole: string): boolean {
  // Check from localStorage user data
  const user = getCurrentUser();
  return user?.role === requiredRole;
}

export function isCoach(): boolean {
  return hasRole('coach');
}

export function isClient(): boolean {
  return hasRole('user');
}

// Get role from cookie (non-HTTP-only)
export function getRoleFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const roleCookie = cookies.find(c => c.trim().startsWith('user_role='));
  
  if (roleCookie) {
    return roleCookie.split('=')[1];
  }
  
  return null;
}