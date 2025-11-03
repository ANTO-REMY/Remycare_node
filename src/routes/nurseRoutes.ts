import { Router } from 'express';
import * as nurseController from '../controllers/nurseController';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateParams } from '../middleware/validate.js';
import { resolveCaseSchema, idParamSchema } from '../validators/schemas.js';

const router = Router();

// Escalated cases
router.get('/cases', authenticate, authorize('nurse'), nurseController.getEscalatedCases);
router.get('/cases/:id', authenticate, authorize('nurse'), validateParams(idParamSchema), nurseController.getCaseById);
router.put('/cases/:id/assign', authenticate, authorize('nurse'), validateParams(idParamSchema), nurseController.assignCaseToSelf);
router.put('/cases/:id/resolve', authenticate, authorize('nurse'), validateParams(idParamSchema), validate(resolveCaseSchema), nurseController.resolveCase);

// Statistics
router.get('/stats', authenticate, authorize('nurse'), nurseController.getNurseStats);

export default router;
