import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Get token from HTTP-only cookie
export function getTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  return token || null;
}

// Get token from Authorization header (backward compatibility)
export function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Try both cookie and header
export function getTokenFromRequest(request: NextRequest): string | null {
  return getTokenFromCookies(request) || getTokenFromHeader(request);
}

// Middleware for protected API routes
export async function authenticateRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return { user: null, error: 'No token provided' };
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return { user: null, error: 'Invalid or expired token' };
  }
  
  return { user, error: null };
}

// Get user role from non-HTTP-only cookie (client-side accessible)
export function getUserRoleFromCookies(request: NextRequest): string | null {
  return request.cookies.get('user_role')?.value || null;
}