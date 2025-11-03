import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, validateParams } from '../middleware/validate.js';
import { updateProfileSchema, idParamSchema } from '../validators/schemas.js';

const router = Router();

// User profile
router.get('/me', authenticate, profileController.getMyProfile);
router.put('/me', authenticate, validate(updateProfileSchema), profileController.updateMyProfile);

// Mother profile
router.get('/mother/:id', authenticate, validateParams(idParamSchema), profileController.getMotherProfile);
router.put('/mother/:id', authenticate, validateParams(idParamSchema), validate(updateProfileSchema), profileController.updateMotherProfile);

// CHW profile
router.get('/chw/:id', authenticate, validateParams(idParamSchema), profileController.getCHWProfile);
router.put('/chw/:id', authenticate, validateParams(idParamSchema), validate(updateProfileSchema), profileController.updateCHWProfile);

// Nurse profile
router.get('/nurse/:id', authenticate, validateParams(idParamSchema), profileController.getNurseProfile);
router.put('/nurse/:id', authenticate, validateParams(idParamSchema), validate(updateProfileSchema), profileController.updateNurseProfile);

export default router;
