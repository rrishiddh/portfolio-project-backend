import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getResumes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resumes = await prisma.resume.findMany({
    where: { userId: req.user!.id },
    select: {
      id: true,
      title: true,
      template: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  res.json({
    success: true,
    data: { resumes },
  });
});

export const getResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  res.json({
    success: true,
    data: { resume },
  });
});

export const createResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    personalInfo,
    experience,
    education,
    skills,
    projects,
    template,
  } = req.body;

  const resume = await prisma.resume.create({
    data: {
      title,
      personalInfo,
      experience,
      education,
      skills,
      projects,
      template,
      userId: req.user!.id,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Resume created successfully',
    data: { resume },
  });
});

export const updateResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    personalInfo,
    experience,
    education,
    skills,
    projects,
    template,
  } = req.body;

  const existingResume = await prisma.resume.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingResume) {
    throw new AppError('Resume not found', 404);
  }

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(personalInfo !== undefined && { personalInfo }),
      ...(experience !== undefined && { experience }),
      ...(education !== undefined && { education }),
      ...(skills !== undefined && { skills }),
      ...(projects !== undefined && { projects }),
      ...(template !== undefined && { template }),
    },
  });

  res.json({
    success: true,
    message: 'Resume updated successfully',
    data: { resume },
  });
});

export const deleteResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Find existing resume
  const existingResume = await prisma.resume.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingResume) {
    throw new AppError('Resume not found', 404);
  }

  await prisma.resume.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Resume deleted successfully',
  });
});

const generateResumeHTML = (resume: any): string => {
  const { personalInfo, experience, education, skills, projects } = resume;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 2.5em;
          font-weight: bold;
          color: #2563eb;
          margin: 0;
        }
        .contact-info {
          margin: 10px 0;
          font-size: 1.1em;
        }
        .section {
          margin: 30px 0;
        }
        .section-title {
          font-size: 1.5em;
          font-weight: bold;
          color: #2563eb;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .item {
          margin: 20px 0;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .item-title {
          font-weight: bold;
          font-size: 1.1em;
        }
        .item-subtitle {
          color: #6b7280;
          font-style: italic;
        }
        .item-date {
          color: #6b7280;
          font-size: 0.9em;
        }
        .item-description {
          margin-top: 8px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .skill-category {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
        }
        .skill-category-title {
          font-weight: bold;
          margin-bottom: 8px;
          color: #2563eb;
        }
        .achievements {
          list-style-type: disc;
          margin-left: 20px;
        }
        .achievements li {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${personalInfo.fullName}</h1>
        <div class="contact-info">
          ${personalInfo.email} ${personalInfo.phone ? `• ${personalInfo.phone}` : ''}
          ${personalInfo.location ? `• ${personalInfo.location}` : ''}
        </div>
        ${personalInfo.website || personalInfo.linkedin || personalInfo.github ? `
          <div class="contact-info">
            ${personalInfo.website ? `<a href="${personalInfo.website}">${personalInfo.website}</a>` : ''}
            ${personalInfo.linkedin ? `${personalInfo.website ? ' • ' : ''}<a href="${personalInfo.linkedin}">LinkedIn</a>` : ''}
            ${personalInfo.github ? `${personalInfo.website || personalInfo.linkedin ? ' • ' : ''}<a href="${personalInfo.github}">GitHub</a>` : ''}
          </div>
        ` : ''}
        ${personalInfo.summary ? `<p style="margin-top: 15px; font-style: italic;">${personalInfo.summary}</p>` : ''}
      </div>

      ${experience && experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${experience.map((exp: any) => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.position}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-date">
                  ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
              ${exp.achievements && exp.achievements.length > 0 ? `
                <ul class="achievements">
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${education && education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${education.map((edu: any) => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                  <div class="item-subtitle">${edu.institution}</div>
                </div>
                <div class="item-date">
                  ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
                </div>
              </div>
              ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
              ${edu.achievements && edu.achievements.length > 0 ? `
                <ul class="achievements">
                  ${edu.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills && skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${Object.entries(skills.reduce((acc: any, skill: any) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill);
              return acc;
            }, {})).map(([category, categorySkills]: [string, any]) => `
              <div class="skill-category">
                <div class="skill-category-title">${category}</div>
                <div>
                  ${categorySkills.map((skill: any) => `
                    ${skill.name}${skill.level ? ` (${skill.level})` : ''}
                  `).join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${projects && projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${projects.map((project: any) => `
            <div class="item">
              <div class="item-title">${project.name}</div>
              <div class="item-description">${project.description}</div>
              ${project.technologies && project.technologies.length > 0 ? `
                <div style="margin-top: 5px;"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
              ` : ''}
              ${project.url || project.github ? `
                <div style="margin-top: 5px;">
                  ${project.url ? `<a href="${project.url}">Live Demo</a>` : ''}
                  ${project.github ? `${project.url ? ' • ' : ''}<a href="${project.github}">GitHub</a>` : ''}
                </div>
              ` : ''}
              ${project.highlights && project.highlights.length > 0 ? `
                <ul class="achievements">
                  ${project.highlights.map((highlight: string) => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

export const generatePDF = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  try {
    const browser = await puppeteer.launch({
  headless: true, 
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

    const page = await browser.newPage();
    
    const html = generateResumeHTML(resume);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new AppError('Failed to generate PDF', 500);
  }
});

export const getResumeAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const [totalResumes, recentResumes] = await Promise.all([
    prisma.resume.count(),
    prisma.resume.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalResumes,
      },
      recentResumes,
    },
  });
});