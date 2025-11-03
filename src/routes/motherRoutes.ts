import { Router } from 'express';
import * as motherController from '../controllers/motherController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Health check-ins
router.post('/checkin', authenticate, authorize('mother'), motherController.createCheckIn);
router.get('/checkins', authenticate, authorize('mother', 'chw', 'nurse'), motherController.getCheckIns);
router.get('/checkin/:id', authenticate, motherController.getCheckInById);

// Weekly tips
router.get('/tips', authenticate, authorize('mother'), motherController.getWeeklyTips);

// Emergency contact
router.put('/emergency-contact', authenticate, authorize('mother'), motherController.updateEmergencyContact);

// Assigned CHW
router.get('/assigned-chw', authenticate, authorize('mother'), motherController.getAssignedCHW);

export default router;
