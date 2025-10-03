import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const {
    page = 1,
    limit = 10,
    search,
    role,
  } = req.query as any;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            blogs: true,
            projects: true,
            resumes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: totalCount,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    },
  });
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
    throw new AppError('Not authorized to view this profile', 403);
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          blogs: true,
          projects: true,
          resumes: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  if (!['USER', 'ADMIN'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  if (req.user!.id === id) {
    throw new AppError('Cannot change your own role', 400);
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: { user },
  });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  if (req.user!.id === id) {
    throw new AppError('Cannot delete your own account', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
    throw new AppError('Not authorized to view these stats', 403);
  }

  const [
    blogStats,
    projectStats,
    resumeStats,
  ] = await Promise.all([
    prisma.blog.aggregate({
      where: { authorId: id },
      _count: { id: true },
      _sum: { views: true },
    }),
    prisma.project.groupBy({
      by: ['status'],
      where: { authorId: id },
      _count: { id: true },
    }),
    prisma.resume.count({
      where: { userId: id },
    }),
  ]);

  const projectStatusCounts = projectStats.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      blogs: {
        total: blogStats._count.id,
        totalViews: blogStats._sum.views || 0,
      },
      projects: {
        total: projectStats.reduce((sum, curr) => sum + curr._count.id, 0),
        completed: projectStatusCounts.COMPLETED || 0,
        inProgress: projectStatusCounts.IN_PROGRESS || 0,
        archived: projectStatusCounts.ARCHIVED || 0,
      },
      resumes: {
        total: resumeStats,
      },
    },
  });
});

export const getUserAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const [
    totalUsers,
    adminUsers,
    regularUsers,
    verifiedUsers,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
      },
      recentUsers,
    },
  });
});