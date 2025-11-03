import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: string;
  name: string;
  email?: string;
  location?: string;
  isActive: boolean;
  sessionCreatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}
