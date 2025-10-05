import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@portfolio.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff',
    },
  });

  const userPassword = await hashPassword('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@portfolio.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@portfolio.com',
      password: userPassword,
      role: 'USER',
      emailVerified: true,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff',
    },
  });

  console.log(' Created users:', { admin: admin.email, user: user.email });

  const blog1 = await prisma.blog.create({
    data: {
      title: 'Getting Started with Next.js and TypeScript',
      slug: 'getting-started-with-nextjs-typescript',
      content: `# Getting Started with Next.js and TypeScript

Next.js is a powerful React framework that makes building web applications a breeze. When combined with TypeScript, it provides an excellent developer experience with type safety and better tooling.

## Why Next.js?

Next.js offers several advantages:

- **Server-side Rendering (SSR)**: Better SEO and initial page load performance
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **API Routes**: Build your backend API alongside your frontend
- **Automatic Code Splitting**: Only load the JavaScript needed for each page
- **Built-in CSS Support**: Support for CSS modules, Sass, and more

## Setting up TypeScript

Setting up TypeScript with Next.js is straightforward:

\`\`\`bash
npx create-next-app@latest my-app --typescript
cd my-app
npm run dev
\`\`\`

That's it! Next.js will automatically configure TypeScript for you.

## Best Practices

1. **Use strict TypeScript configuration** - Enable strict mode for better type checking
2. **Define proper interfaces for your data** - Create reusable type definitions
3. **Leverage Next.js built-in TypeScript features** - Use GetStaticProps, GetServerSideProps types
4. **Use proper error handling** - Always handle errors gracefully

## Creating Your First Page

Here's a simple example of a TypeScript Next.js page:

\`\`\`typescript
import { GetStaticProps } from 'next';

interface HomeProps {
  message: string;
}

export default function Home({ message }: HomeProps) {
  return <h1>{message}</h1>;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      message: 'Hello, Next.js with TypeScript!',
    },
  };
};
\`\`\`

## Conclusion

Start building amazing applications with Next.js and TypeScript today! The combination provides a robust foundation for modern web development.`,
      excerpt: 'Learn how to get started with Next.js and TypeScript for building modern web applications with type safety and excellent developer experience.',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      published: true,
      featured: true,
      tags: ['Next.js', 'TypeScript', 'React', 'Web Development', 'Tutorial'],
      seoTitle: 'Getting Started with Next.js and TypeScript - Complete Guide 2024',
      seoDescription: 'Learn how to set up and use Next.js with TypeScript for building modern, type-safe web applications. Complete beginner-friendly tutorial.',
      readTime: 5,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-nodejs-express',
      content: `# Building RESTful APIs with Node.js and Express

Node.js and Express provide a powerful combination for building scalable RESTful APIs. In this comprehensive guide, we'll explore the fundamentals of API development.

## What is REST?

REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless communication and standard HTTP methods.

### HTTP Methods

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources

## Setting up Express

First, let's set up a basic Express server:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Best Practices

### 1. Use Proper HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

### 2. Implement Proper Error Handling

Always use try-catch blocks and middleware for error handling.

### 3. Add Request Validation

Use libraries like Joi or Zod to validate incoming data.

### 4. Use Middleware for Common Functionality

Create reusable middleware for authentication, logging, etc.

### 5. Follow Consistent Naming Conventions

Use plural nouns for resource endpoints: \`/api/users\`, \`/api/posts\`

## Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Validate and sanitize all inputs
- Use authentication and authorization
- Keep dependencies updated

## Conclusion

Building RESTful APIs with Node.js and Express is straightforward and powerful. Follow these best practices to create maintainable and scalable APIs.

Happy coding!`,
      excerpt: 'Learn the fundamentals of building RESTful APIs using Node.js and Express framework. Complete guide with best practices and security considerations.',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      published: true,
      featured: false,
      tags: ['Node.js', 'Express', 'API', 'Backend', 'REST', 'Tutorial'],
      seoTitle: 'Building RESTful APIs with Node.js and Express - Best Practices',
      seoDescription: 'Complete guide to building scalable RESTful APIs using Node.js and Express framework with security best practices.',
      readTime: 8,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      authorId: admin.id,
    },
  });

  const blog3 = await prisma.blog.create({
    data: {
      title: 'Understanding React Hooks: A Deep Dive',
      slug: 'understanding-react-hooks-deep-dive',
      content: `# Understanding React Hooks: A Deep Dive

React Hooks have revolutionized the way we write React components. Let's explore the most commonly used hooks and their use cases.

## useState

The most basic hook for managing component state:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect

For side effects like data fetching, subscriptions, or DOM manipulation:

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

## useContext

For accessing context values without prop drilling:

\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

## Custom Hooks

Create reusable logic by building your own hooks:

\`\`\`javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading };
}
\`\`\`

## Best Practices

1. Always call hooks at the top level
2. Only call hooks from React functions
3. Use the ESLint plugin for hooks
4. Keep effects focused and simple
5. Clean up effects when necessary

Master React Hooks to write cleaner, more maintainable React code!`,
      excerpt: 'Deep dive into React Hooks including useState, useEffect, useContext, and custom hooks. Learn best practices for modern React development.',
      coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
      published: true,
      featured: false,
      tags: ['React', 'JavaScript', 'Hooks', 'Frontend', 'Web Development'],
      seoTitle: 'Understanding React Hooks - Complete Guide with Examples',
      seoDescription: 'Master React Hooks with this comprehensive guide covering useState, useEffect, useContext, and custom hooks with practical examples.',
      readTime: 6,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
      authorId: admin.id,
    },
  });

  console.log(' Created blog posts:', { 
    blog1: blog1.title, 
    blog2: blog2.title,
    blog3: blog3.title 
  });

  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-stack e-commerce platform built with Next.js, Node.js, and PostgreSQL featuring user authentication, product management, shopping cart, and payment integration.',
      content: `# E-commerce Platform

A modern, full-stack e-commerce solution that provides a seamless shopping experience for customers and powerful management tools for administrators.

## Features

### Customer Features
- User authentication and authorization with JWT
- Browse product catalog with categories and filters
- Advanced search functionality
- Shopping cart management
- Secure checkout process
- Payment integration with Stripe
- Order tracking and history
- User profile management
- Wishlist functionality
- Product reviews and ratings

### Admin Features
- Comprehensive admin dashboard
- Product management (CRUD operations)
- Inventory tracking
- Order management system
- Customer management
- Sales analytics and reports
- Discount and coupon management

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Payment**: Stripe API
- **Authentication**: JWT, bcrypt
- **State Management**: Redux Toolkit
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **Image Storage**: Cloudinary

## Key Challenges & Solutions

### 1. Performance Optimization
- Implemented server-side rendering for better SEO
- Used React Query for efficient data caching
- Optimized images with Next.js Image component
- Implemented lazy loading for product images

### 2. Security
- Secure payment processing with Stripe
- Protected user data with bcrypt hashing
- Implemented CSRF protection
- Rate limiting for API endpoints

### 3. Scalability
- Designed with microservices architecture in mind
- Implemented database indexing for faster queries
- Used Redis for caching frequently accessed data

## Results

The platform successfully handles thousands of transactions monthly and provides an excellent user experience with a 4.8/5 customer satisfaction rating.`,
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
      ],
      technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'TypeScript', 'Tailwind CSS', 'Redux', 'Prisma'],
      features: [
        'User Authentication & Authorization',
        'Product Management System',
        'Shopping Cart & Checkout',
        'Payment Integration (Stripe)',
        'Admin Dashboard',
        'Order Tracking',
        'Inventory Management',
        'Sales Analytics'
      ],
      liveUrl: 'https://ecommerce-demo.vercel.app',
      githubUrl: 'https://github.com/username/ecommerce-platform',
      status: 'COMPLETED',
      featured: true,
      order: 1,
      authorId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Task Management App',
      slug: 'task-management-app',
      description: 'A collaborative task management application with real-time updates, team features, and project organization capabilities built with React and Socket.io.',
      content: `# Task Management App

A comprehensive task management solution designed for teams to collaborate effectively and track project progress in real-time.

## Features

- **Task Management**: Create, update, delete, and organize tasks
- **Real-time Collaboration**: Live updates using WebSocket connections
- **Project Boards**: Organize tasks with Kanban-style boards
- **Team Management**: Invite team members and assign tasks
- **File Attachments**: Upload and share files with tasks
- **Comments & Mentions**: Discuss tasks with @mentions
- **Time Tracking**: Track time spent on tasks
- **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- **Due Dates & Reminders**: Never miss a deadline
- **Activity History**: Track all changes and updates
- **Search & Filters**: Quickly find tasks
- **Mobile Responsive**: Works on all devices

## Technologies

- **Frontend**: React 18, Redux Toolkit, Material-UI
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **Real-time**: WebSocket connections
- **File Storage**: AWS S3
- **Authentication**: JWT
- **State Management**: Redux Toolkit

## Architecture

The application uses a modern microservices architecture with:
- RESTful API for CRUD operations
- WebSocket server for real-time updates
- Redis for session management
- AWS S3 for file storage

This project demonstrates my ability to build complex, real-time applications with modern web technologies and deliver excellent user experiences.`,
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Material-UI', 'Redux', 'AWS S3'],
      features: [
        'Real-time Collaboration',
        'Task Prioritization',
        'Team Management',
        'File Attachments',
        'Time Tracking',
        'Kanban Boards',
        'Comments & Mentions',
        'Mobile Responsive'
      ],
      liveUrl: 'https://taskmanager-demo.netlify.app',
      githubUrl: 'https://github.com/username/task-manager',
      status: 'COMPLETED',
      featured: true,
      order: 2,
      authorId: admin.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Weather Forecast Dashboard',
      slug: 'weather-forecast-dashboard',
      description: 'A beautiful weather dashboard that provides real-time weather information and forecasts using OpenWeatherMap API with interactive charts and maps.',
      content: `# Weather Forecast Dashboard

An elegant weather application that provides comprehensive weather information with beautiful visualizations.

## Features

- Current weather conditions
- 7-day weather forecast
- Hourly forecast
- Weather maps (temperature, precipitation, wind)
- Location search
- Favorite locations
- Weather alerts and notifications
- Historical weather data
- Interactive charts and graphs

## Technologies

- React, TypeScript, Chart.js
- OpenWeatherMap API
- Leaflet for maps
- Recharts for data visualization

Built to showcase API integration and data visualization skills.`,
      thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80'],
      technologies: ['React', 'TypeScript', 'Chart.js', 'Leaflet', 'OpenWeatherMap API'],
      features: [
        'Real-time Weather Data',
        '7-day Forecast',
        'Weather Maps',
        'Location Search',
        'Interactive Charts',
        'Weather Alerts'
      ],
      liveUrl: 'https://weather-dashboard-demo.vercel.app',
      githubUrl: 'https://github.com/username/weather-dashboard',
      status: 'COMPLETED',
      featured: false,
      order: 3,
      authorId: admin.id,
    },
  });

  console.log(' Created projects:', { 
    project1: project1.title, 
    project2: project2.title,
    project3: project3.title 
  });

  const resume = await prisma.resume.create({
    data: {
      title: 'Software Developer Resume',
      personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        summary: 'Passionate full-stack developer with 3+ years of experience building modern web applications using React, Node.js, and cloud technologies. Strong problem-solving skills and commitment to writing clean, maintainable code.'
      },
      experience: [
        {
          position: 'Senior Full Stack Developer',
          company: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          startDate: 'Jan 2022',
          endDate: 'Present',
          current: true,
          description: 'Lead development of scalable web applications using React, Node.js, and AWS.',
          achievements: [
            'Reduced page load times by 40% through performance optimizations and lazy loading',
            'Led a team of 4 developers on a critical product launch that generated $2M in revenue',
            'Implemented CI/CD pipelines that reduced deployment time by 60%',
            'Architected and built microservices infrastructure serving 100k+ daily users'
          ]
        },
        {
          position: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Remote',
          startDate: 'Jun 2020',
          endDate: 'Dec 2021',
          current: false,
          description: 'Developed and maintained multiple web applications for various clients using modern JavaScript frameworks.',
          achievements: [
            'Built 5+ production applications from scratch using React and Node.js',
            'Improved application security by implementing OAuth 2.0 and JWT authentication',
            'Mentored 3 junior developers and conducted regular code reviews',
            'Reduced API response time by 35% through database optimization'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          institution: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          startDate: '2016',
          endDate: '2020',
          current: false,
          gpa: '3.8',
          achievements: [
            'Dean\'s List for 6 semesters',
            'President of Computer Science Club',
            'Graduated Magna Cum Laude',
            'Completed honors thesis on machine learning algorithms'
          ]
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Expert', category: 'Programming Languages' },
        { name: 'TypeScript', level: 'Advanced', category: 'Programming Languages' },
        { name: 'Python', level: 'Intermediate', category: 'Programming Languages' },
        { name: 'Java', level: 'Intermediate', category: 'Programming Languages' },
        { name: 'React', level: 'Expert', category: 'Frontend' },
        { name: 'Next.js', level: 'Advanced', category: 'Frontend' },
        { name: 'Vue.js', level: 'Intermediate', category: 'Frontend' },
        { name: 'Tailwind CSS', level: 'Advanced', category: 'Frontend' },
        { name: 'Node.js', level: 'Expert', category: 'Backend' },
        { name: 'Express', level: 'Advanced', category: 'Backend' },
        { name: 'NestJS', level: 'Intermediate', category: 'Backend' },
        { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
        { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
        { name: 'Redis', level: 'Intermediate', category: 'Database' },
        { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
        { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
        { name: 'Git', level: 'Advanced', category: 'Tools' }
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
          technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
          url: 'https://ecommerce-demo.vercel.app',
          github: 'https://github.com/johndoe/ecommerce',
          highlights: [
            'Handles 1000+ concurrent users',
            'Integrated with multiple payment providers',
            'Admin dashboard with real-time analytics'
          ]
        },
        {
          name: 'Task Management App',
          description: 'Real-time collaborative task management application',
          technologies: ['React', 'Socket.io', 'MongoDB'],
          url: 'https://taskmanager-demo.netlify.app',
          github: 'https://github.com/johndoe/task-manager',
          highlights: [
            'Real-time updates using WebSockets',
            'Team collaboration features',
            'Mobile-responsive design'
          ]
        }
      ],
      template: 'modern',
      userId: user.id,
    },
  });

  console.log(' Created resume:', resume.title);

  console.log('\n Seeding completed successfully!');
  console.log('\n Summary:');
  console.log(`   Users: 2 (1 Admin, 1 User)`);
  console.log(`   Blogs: 3`);
  console.log(`   Projects: 3`);
  console.log(`   Resumes: 1`);
  console.log('\n Login Credentials:');
  console.log(`   Admin: admin@portfolio.com / admin123`);
  console.log(`   User:  user@portfolio.com / user123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });