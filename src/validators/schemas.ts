import { z } from 'zod';

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const motherIdParamSchema = z.object({
  motherId: z.string().uuid('Invalid mother ID format'),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

// Auth validation schemas
export const registerSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['mother', 'chw', 'nurse'], {
    message: 'Role must be mother, chw, or nurse',
  }),
  email: z.string().email('Invalid email format').optional(),
  location: z.string().optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().min(1, 'Role is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Profile validation schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  // Mother fields
  dueDate: z.string().datetime().optional(),
  pregnancyWeek: z.number().min(0).max(42).optional(),
  postpartumWeek: z.number().min(0).optional(),
  status: z.enum(['ok', 'not_ok', 'no_response']).optional(),
  medicalHistory: z.string().optional(),
  emergencyContact: z.string().optional(),
  // CHW fields
  certificationNumber: z.string().optional(),
  maxMothersCapacity: z.number().min(1).optional(),
  specializations: z.string().optional(),
  // Nurse fields
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
});

export const updateMotherProfileSchema = z.object({
  dueDate: z.string().datetime().optional(),
  pregnancyWeek: z.number().min(0).max(42).optional(),
  postpartumWeek: z.number().min(0).optional(),
  status: z.enum(['ok', 'not_ok', 'no_response']).optional(),
  medicalHistory: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const updateCHWProfileSchema = z.object({
  certificationNumber: z.string().optional(),
  maxMothersCapacity: z.number().min(1).optional(),
  specializations: z.string().optional(),
});

export const updateNurseProfileSchema = z.object({
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
});

// Mother validation schemas
export const healthCheckInSchema = z.object({
  status: z.enum(['ok', 'not_ok', 'no_response']),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 characters'),
});

// CHW validation schemas
export const escalateCaseSchema = z.object({
  motherId: z.string().uuid('Invalid mother ID'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  issueType: z.enum(['medical', 'mental_health', 'emergency', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  notes: z.string().optional(),
});

// Nurse validation schemas
export const resolveCaseSchema = z.object({
  resolution: z.string().min(10, 'Resolution must be at least 10 characters'),
  notes: z.string().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateMotherProfileInput = z.infer<typeof updateMotherProfileSchema>;
export type UpdateCHWProfileInput = z.infer<typeof updateCHWProfileSchema>;
export type UpdateNurseProfileInput = z.infer<typeof updateNurseProfileSchema>;
export type HealthCheckInInput = z.infer<typeof healthCheckInSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type EscalateCaseInput = z.infer<typeof escalateCaseSchema>;
export type ResolveCaseInput = z.infer<typeof resolveCaseSchema>;
