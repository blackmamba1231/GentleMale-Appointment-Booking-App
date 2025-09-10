import type { Request, Response, NextFunction } from "express";
import * as service from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.verify(req.body);
    res.status(200).json(result);
  } catch (e) { next(e); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.login(req.body, req);
    res.json(result);
  } catch (e) { next(e); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.refresh(req.body);
    res.json(result);
  } catch (e) { next(e); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await service.logout(req.body.sessionId);
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function me(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
  res.json(req.user);
}

