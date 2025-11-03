import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/schemas.js';
import { sensitiveRateLimit } from '../middleware/security.js';

const router = Router();

// Apply stricter rate limiting to auth endpoints (5 attempts per 15 minutes)
const authRateLimit = sensitiveRateLimit(5, 15 * 60 * 1000);

router.post('/register', authRateLimit, validate(registerSchema), authController.register);
router.post('/login', authRateLimit, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

export default router;
