import { Router } from 'express';
import * as chwController from '../controllers/chwController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Assigned mothers
router.get('/mothers', authenticate, authorize('chw'), chwController.getAssignedMothers);
router.get('/mothers/:id', authenticate, authorize('chw'), chwController.getMotherDetails);

// Case escalation
router.post('/escalate', authenticate, authorize('chw'), chwController.escalateCase);

// Health check-ins for assigned mothers
router.post('/checkin/:motherId', authenticate, authorize('chw'), chwController.createMotherCheckIn);

export default router;
