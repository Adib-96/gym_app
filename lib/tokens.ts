// app/api/lib/tokens.ts
import { randomBytes } from 'crypto';

export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

export function calculateExpiryDate(hours: number = 1): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}