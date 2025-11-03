import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';

/**
 * Input sanitization middleware to prevent XSS attacks
 */
export const sanitizeInput = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query params
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize an object by removing potentially dangerous characters
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize a string by removing potentially dangerous characters
 */
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove < and > to prevent script tags
    .trim();
}

/**
 * Middleware to ensure HTTPS in production
 */
export const enforceHttps = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.status(403).json({
      success: false,
      message: 'HTTPS is required in production',
    });
  }
  next();
};

/**
 * Middleware to add security headers
 */
export const securityHeaders = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Middleware to check user account status
 */
export const checkAccountStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next();
  }

  // User is attached by authenticate middleware
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.',
    });
  }

  next();
};

/**
 * Middleware to prevent brute force on sensitive endpoints
 */
export const sensitiveRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetAt: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();
    const attempt = attempts.get(identifier);

    if (attempt && now < attempt.resetAt) {
      if (attempt.count >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: `Too many attempts. Please try again later.`,
          retryAfter: Math.ceil((attempt.resetAt - now) / 1000),
        });
      }
      attempt.count++;
    } else {
      attempts.set(identifier, { count: 1, resetAt: now + windowMs });
    }

    // Cleanup old entries
    if (attempts.size > 10000) {
      for (const [key, value] of attempts.entries()) {
        if (now >= value.resetAt) {
          attempts.delete(key);
        }
      }
    }

    next();
  };
};

/**
 * Validate session freshness for sensitive operations
 */
export const requireFreshSession = (maxAgeMinutes: number = 30) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.sessionCreatedAt) {
      return res.status(401).json({
        success: false,
        message: 'Session information missing',
      });
    }

    const sessionAge = Date.now() - new Date(req.user.sessionCreatedAt).getTime();
    const maxAge = maxAgeMinutes * 60 * 1000;

    if (sessionAge > maxAge) {
      return res.status(401).json({
        success: false,
        message: 'Session too old. Please re-authenticate for this action.',
        code: 'SESSION_TOO_OLD',
      });
    }

    next();
  };
};
