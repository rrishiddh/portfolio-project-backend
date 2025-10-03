import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectAnalytics,
  getTechnologies,
  reorderProjects,
} from '../controllers/projectController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { validateId,createProjectSchema,updateProjectSchema,validatePagination } from '../utils/validation';


const router = Router();

router.get('/', optionalAuth, getProjects);
router.get('/technologies', getTechnologies);
router.get('/:slug', getProject);

router.post('/', authenticate, authorize('ADMIN'), validateBody(createProjectSchema), createProject);
router.patch('/:id', authenticate, authorize('ADMIN'), validateParams(validateId), validateBody(updateProjectSchema), updateProject);
router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(validateId), deleteProject);
router.post('/reorder', authenticate, authorize('ADMIN'), reorderProjects);

router.get('/analytics/overview', authenticate, authorize('ADMIN'), getProjectAnalytics);

export default router;