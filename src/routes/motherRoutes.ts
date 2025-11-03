import { Router } from 'express';
import * as motherController from '../controllers/motherController';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateParams } from '../middleware/validate.js';
import { healthCheckInSchema, emergencyContactSchema, idParamSchema } from '../validators/schemas.js';

const router = Router();

// Health check-ins
router.post('/checkin', authenticate, authorize('mother'), validate(healthCheckInSchema), motherController.createCheckIn);
router.get('/checkins', authenticate, authorize('mother', 'chw', 'nurse'), motherController.getCheckIns);
router.get('/checkin/:id', authenticate, validateParams(idParamSchema), motherController.getCheckInById);

// Weekly tips
router.get('/tips', authenticate, authorize('mother'), motherController.getWeeklyTips);

// Emergency contact
router.put('/emergency-contact', authenticate, authorize('mother'), validate(emergencyContactSchema), motherController.updateEmergencyContact);

// Assigned CHW
router.get('/assigned-chw', authenticate, authorize('mother'), motherController.getAssignedCHW);

export default router;
