import { z } from 'zod';

// User validation
export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['user', 'coach']).default('user'),
});

// Client validation
export const ClientSchema = z.object({
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  gender: z.enum(['male', 'female', 'other']).optional(),
  health_notes: z.string().optional(),
  user_id: z.string().uuid(),
  coach_id: z.string().uuid(),
});

// Workout validation
export const WorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  coach_id: z.string().uuid(),
});

// Login validation
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});