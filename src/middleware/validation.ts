import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = <T extends Record<string, string>>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as unknown as typeof req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = <T extends Record<string, any>>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as unknown as typeof req.query;
      next();
    } catch (error) {
      next(error);
    }
  };
};
