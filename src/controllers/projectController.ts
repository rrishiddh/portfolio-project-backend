import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    technology,
    status,
    featured,
    author,
  } = req.query as any;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};

  if (featured === 'true') {
    where.featured = true;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (technology) {
    where.technologies = { has: technology };
  }

  if (author) {
    where.authorId = author;
  }

  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.json({
    success: true,
    data: projects,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: totalCount,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    },
  });
});

export const getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json({
    success: true,
    data: { project },
  });
});

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    content,
    thumbnail,
    images,
    technologies,
    features,
    liveUrl,
    githubUrl,
    status,
    featured,
    order,
  } = req.body;

  const slug = generateSlug(title);

  const existingProject = await prisma.project.findUnique({ where: { slug } });
  if (existingProject) {
    throw new AppError('A project with this title already exists', 409);
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      thumbnail,
      images: images || [],
      technologies: technologies || [],
      features: features || [],
      liveUrl,
      githubUrl,
      status: status || 'COMPLETED',
      featured: featured || false,
      order: order || 0,
      authorId: req.user!.id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: { project },
  });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    content,
    thumbnail,
    images,
    technologies,
    features,
    liveUrl,
    githubUrl,
    status,
    featured,
    order,
  } = req.body;

  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  if (req.user!.role !== 'ADMIN' && existingProject.authorId !== req.user!.id) {
    throw new AppError('Not authorized to update this project', 403);
  }

  let slug = existingProject.slug;

  if (title && title !== existingProject.title) {
    slug = generateSlug(title);
    
    const slugExists = await prisma.project.findFirst({
      where: { slug, NOT: { id } },
    });
    
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const updateData: any = {
    ...(title !== undefined && { title }),
    ...(slug !== existingProject.slug && { slug }),
    ...(description !== undefined && { description }),
    ...(content !== undefined && { content }),
    ...(thumbnail !== undefined && { thumbnail }),
    ...(images !== undefined && { images }),
    ...(technologies !== undefined && { technologies }),
    ...(features !== undefined && { features }),
    ...(liveUrl !== undefined && { liveUrl }),
    ...(githubUrl !== undefined && { githubUrl }),
    ...(status !== undefined && { status }),
    ...(featured !== undefined && { featured }),
    ...(order !== undefined && { order }),
  };

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: { project },
  });
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (req.user!.role !== 'ADMIN' && project.authorId !== req.user!.id) {
    throw new AppError('Not authorized to delete this project', 403);
  }

  await prisma.project.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

export const getProjectAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const [
    totalProjects,
    completedProjects,
    inProgressProjects,
    archivedProjects,
    featuredProjects,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.project.count({ where: { status: 'ARCHIVED' } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.project.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        featured: true,
        createdAt: true,
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        archivedProjects,
        featuredProjects,
      },
      recentProjects,
    },
  });
});

export const getTechnologies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({
    select: { technologies: true },
  });

  const techCounts: Record<string, number> = {};
  
  projects.forEach((project) => {
    project.technologies.forEach((tech) => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });

  const technologies = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    success: true,
    data: { technologies },
  });
});

export const reorderProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectIds } = req.body;

  if (!Array.isArray(projectIds)) {
    throw new AppError('Project IDs must be an array', 400);
  }

  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const updatePromises = projectIds.map((id: string, index: number) =>
    prisma.project.update({
      where: { id },
      data: { order: index },
    })
  );

  await Promise.all(updatePromises);

  res.json({
    success: true,
    message: 'Projects reordered successfully',
  });
});