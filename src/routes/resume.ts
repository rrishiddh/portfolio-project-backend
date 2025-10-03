import { Router } from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  generatePDF,
  getResumeAnalytics,
} from '../controllers/resumeController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { validateId,updateResumeSchema, createResumeSchema} from '../utils/validation';


const router = Router();

router.use(authenticate);

router.get('/', getResumes);
router.get('/:id', validateParams(validateId), getResume);
router.post('/', validateBody(createResumeSchema), createResume);
router.patch('/:id', validateParams(validateId), validateBody(updateResumeSchema), updateResume);
router.delete('/:id', validateParams(validateId), deleteResume);
router.get('/:id/pdf', validateParams(validateId), generatePDF);

router.get('/analytics/overview', authorize('ADMIN'), getResumeAnalytics);

export default router;