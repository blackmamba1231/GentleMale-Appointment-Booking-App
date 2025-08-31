import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  const err = new Error("NOT_FOUND");
  (err as any).status = 404;
  next(err);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? (err.message === "UNAUTHORIZED" ? 401 :
                                err.message === "VALIDATION_ERROR" ? 400 :
                                err.message?.includes("EXISTS") ? 409 :
                                400);
  res.status(status).json({ error: err.message ?? "UNKNOWN_ERROR", details: err.issues ?? undefined });
}
