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

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const getBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    tag,
    featured,
    published = 'true',
    author,
  } = req.query as any;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};

  if (published !== 'all') {
    where.published = published === 'true';
  }

  if (featured === 'true') {
    where.featured = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (author) {
    where.authorId = author;
  }

  const [blogs, totalCount] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
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
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.json({
    success: true,
    data: blogs,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: totalCount,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    },
  });
});

export const getBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const blog = await prisma.blog.findUnique({
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

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  if (blog.published) {
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });
  }

  res.json({
    success: true,
    data: { blog },
  });
});

export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    content,
    excerpt,
    coverImage,
    published,
    featured,
    tags,
    seoTitle,
    seoDescription,
  } = req.body;

  const slug = generateSlug(title);
  const readTime = calculateReadTime(content);

  const existingBlog = await prisma.blog.findUnique({ where: { slug } });
  if (existingBlog) {
    throw new AppError('A blog with this title already exists', 409);
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      coverImage,
      published,
      featured,
      readTime,
      tags,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      publishedAt: published ? new Date() : null,
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
    message: 'Blog created successfully',
    data: { blog },
  });
});

export const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    excerpt,
    coverImage,
    published,
    featured,
    tags,
    seoTitle,
    seoDescription,
  } = req.body;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new AppError('Blog not found', 404);
  }

  if (req.user!.role !== 'ADMIN' && existingBlog.authorId !== req.user!.id) {
    throw new AppError('Not authorized to update this blog', 403);
  }

  let slug = existingBlog.slug;
  let readTime = existingBlog.readTime;

  if (title && title !== existingBlog.title) {
    slug = generateSlug(title);
    
    const slugExists = await prisma.blog.findFirst({
      where: { slug, NOT: { id } },
    });
    
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  if (content && content !== existingBlog.content) {
    readTime = calculateReadTime(content);
  }

  const updateData: any = {
    ...(title !== undefined && { title }),
    ...(slug !== existingBlog.slug && { slug }),
    ...(content !== undefined && { content }),
    ...(excerpt !== undefined && { excerpt }),
    ...(coverImage !== undefined && { coverImage }),
    ...(published !== undefined && { published }),
    ...(featured !== undefined && { featured }),
    ...(tags !== undefined && { tags }),
    ...(seoTitle !== undefined && { seoTitle }),
    ...(seoDescription !== undefined && { seoDescription }),
    ...(readTime !== existingBlog.readTime && { readTime }),
  };

  if (published && !existingBlog.published) {
    updateData.publishedAt = new Date();
  } else if (!published && existingBlog.published) {
    updateData.publishedAt = null;
  }

  const blog = await prisma.blog.update({
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
    message: 'Blog updated successfully',
    data: { blog },
  });
});

export const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  if (req.user!.role !== 'ADMIN' && blog.authorId !== req.user!.id) {
    throw new AppError('Not authorized to delete this blog', 403);
  }

  await prisma.blog.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Blog deleted successfully',
  });
});

export const getBlogAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    featuredBlogs,
    totalViews,
    recentBlogs,
    topBlogs,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { published: true } }),
    prisma.blog.count({ where: { published: false } }),
    prisma.blog.count({ where: { featured: true } }),
    prisma.blog.aggregate({
      _sum: { views: true },
    }),
    prisma.blog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        views: true,
        createdAt: true,
      },
    }),
    prisma.blog.findMany({
      take: 10,
      where: { published: true },
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        featuredBlogs,
        totalViews: totalViews._sum.views || 0,
      },
      recentBlogs,
      topBlogs,
    },
  });
});

export const getTags = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagCounts: Record<string, number> = {};
  
  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    success: true,
    data: { tags },
  });
});