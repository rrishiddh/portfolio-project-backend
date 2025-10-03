import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  coverImage: z.string().url('Invalid cover image URL').optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  content: z.string().optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  liveUrl: z.string().url('Invalid live URL').optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).default('COMPLETED'),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  github: z.string().url('Invalid GitHub URL').optional(),
  summary: z.string().optional(),
});

export const experienceSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  achievements: z.array(z.string()).default([]),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
});

export const projectResumeSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).default([]),
  url: z.string().url('Invalid project URL').optional(),
  github: z.string().url('Invalid GitHub URL').optional(),
  highlights: z.array(z.string()).default([]),
});

export const createResumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectResumeSchema).default([]),
  template: z.string().default('modern'),
});

export const updateResumeSchema = createResumeSchema.partial();

export const validatePagination = z.object({
  page: z.string().transform((val) => parseInt(val) || 1).refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z.string().transform((val) => parseInt(val) || 10).refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
});

export const validateId = z.object({
  id: z.string().min(1, 'ID is required'),
});