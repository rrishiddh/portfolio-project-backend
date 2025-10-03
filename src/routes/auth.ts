
import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { loginSchema, registerSchema,changePasswordSchema,updateProfileSchema } from '../utils/validation';


const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/google', googleAuth);
router.post('/refresh', refreshToken);

router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, validateBody(updateProfileSchema), updateProfile);
router.patch('/change-password', authenticate, validateBody(changePasswordSchema), changePassword);

export default router;