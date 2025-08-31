import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization?.split(" ");
  const token = header?.[0] === "Bearer" ? header[1] : undefined;
  if (!token) return next(new Error("UNAUTHORIZED"));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string, [k: string]: any };
    (req as any).user = { id: payload.sub, sessionId: (payload as any).sid };
    next();
  } catch {
    next(new Error("UNAUTHORIZED"));
  }
}
