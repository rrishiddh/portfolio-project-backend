export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  googleId?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  featured: boolean;
  views: number;
  readTime?: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
  author: User;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  thumbnail?: string;
  images: string[];
  technologies: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: User;
}

export interface Resume {
  id: string;
  title: string;
  personalInfo: any;
  experience?: any;
  education?: any;
  skills?: any;
  projects?: any;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}