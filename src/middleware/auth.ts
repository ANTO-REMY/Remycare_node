import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    // Store minimal user info from JWT
    req.user = {
      id: payload.userId,
      role: payload.role,
      phone: '', // Not in JWT, would need to fetch from DB if needed
      name: '', // Not in JWT, would need to fetch from DB if needed
      isActive: true,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
