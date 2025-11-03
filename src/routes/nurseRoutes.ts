import { Router } from 'express';
import * as nurseController from '../controllers/nurseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Escalated cases
router.get('/cases', authenticate, authorize('nurse'), nurseController.getEscalatedCases);
router.get('/cases/:id', authenticate, authorize('nurse'), nurseController.getCaseById);
router.put('/cases/:id/assign', authenticate, authorize('nurse'), nurseController.assignCaseToSelf);
router.put('/cases/:id/resolve', authenticate, authorize('nurse'), nurseController.resolveCase);

// Statistics
router.get('/stats', authenticate, authorize('nurse'), nurseController.getNurseStats);

export default router;
