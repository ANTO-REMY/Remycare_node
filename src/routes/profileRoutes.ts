import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// User profile
router.get('/me', authenticate, profileController.getMyProfile);
router.put('/me', authenticate, profileController.updateMyProfile);

// Mother profile
router.get('/mother/:id', authenticate, profileController.getMotherProfile);
router.put('/mother/:id', authenticate, profileController.updateMotherProfile);

// CHW profile
router.get('/chw/:id', authenticate, profileController.getCHWProfile);
router.put('/chw/:id', authenticate, profileController.updateCHWProfile);

// Nurse profile
router.get('/nurse/:id', authenticate, profileController.getNurseProfile);
router.put('/nurse/:id', authenticate, profileController.updateNurseProfile);

export default router;
