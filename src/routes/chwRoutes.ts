import { Router } from 'express';
import * as chwController from '../controllers/chwController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateParams } from '../middleware/validate.js';
import { escalateCaseSchema, healthCheckInSchema, idParamSchema, motherIdParamSchema } from '../validators/schemas.js';

const router = Router();

// Assigned mothers
router.get('/mothers', authenticate, authorize('chw'), chwController.getAssignedMothers);
router.get('/mothers/:id', authenticate, authorize('chw'), validateParams(idParamSchema), chwController.getMotherDetails);

// Case escalation
router.post('/escalate', authenticate, authorize('chw'), validate(escalateCaseSchema), chwController.escalateCase);

// Health check-ins for assigned mothers
router.post('/checkin/:motherId', authenticate, authorize('chw'), validateParams(motherIdParamSchema), validate(healthCheckInSchema), chwController.createMotherCheckIn);

export default router;
