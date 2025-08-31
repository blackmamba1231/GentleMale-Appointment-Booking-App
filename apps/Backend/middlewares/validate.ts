import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!parsed.success) return next(Object.assign(new Error("VALIDATION_ERROR"), { issues: parsed.error.issues }));
    Object.assign(req, parsed.data);
    next();
  };
