import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = { ...error };
  err.message = error.message;

  console.error(error);

  if (error.name === 'CastError') {
    const message = 'Resource not found';
    err = new AppError(message, 404);
  }

  if (error.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new AppError(message, 400);
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((val: any) => val.message);
    err = new AppError(message.join(', '), 400);
  }

  if (error.code === 'P2002') {
    const message = 'Duplicate field value entered';
    err = new AppError(message, 400);
  }

  if (error.code === 'P2025') {
    const message = 'Record not found';
    err = new AppError(message, 404);
  }

if (error instanceof ZodError) {
  const message = error.issues
    .map((issue: ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
  err = new AppError(message, 400);
}



  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    err = new AppError(message, 401);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    err = new AppError(message, 401);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};