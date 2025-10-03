
import { Router } from 'express';
import {
    getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats,
  getUserAnalytics,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateParams, validateBody } from '../middleware/validation';
import { validateId } from './../utils/validation';
import { z } from 'zod';

const router = Router();

const updateRoleSchema = z.object({
  role: z
    .enum(['USER', 'ADMIN'])
    .refine((val) => val === 'USER' || val === 'ADMIN', {
      message: 'Role must be either USER or ADMIN',
    }),
});


router.use(authenticate);

router.get('/:id', validateParams(validateId), getUser);
router.get('/:id/stats', validateParams(validateId), getUserStats);

router.get('/', authorize('ADMIN'), getUsers);
router.patch('/:id/role', authorize('ADMIN'), validateParams(validateId), validateBody(updateRoleSchema), updateUserRole);
router.delete('/:id', authorize('ADMIN'), validateParams(validateId), deleteUser);
router.get('/analytics/overview', authorize('ADMIN'), getUserAnalytics);

export default router;