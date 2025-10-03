import { Router } from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogAnalytics,
  getTags,
} from '../controllers/blogController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { validateId,createBlogSchema,updateBlogSchema } from '../utils/validation';


const router = Router();

router.get('/', optionalAuth, getBlogs);
router.get('/tags', getTags);
router.get('/:slug', getBlog);

router.post('/', authenticate, authorize('ADMIN'), validateBody(createBlogSchema), createBlog);
router.patch('/:id', authenticate, authorize('ADMIN'), validateParams(validateId), validateBody(updateBlogSchema), updateBlog);
router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(validateId), deleteBlog);

router.get('/analytics/overview', authenticate, authorize('ADMIN'), getBlogAnalytics);

export default router;