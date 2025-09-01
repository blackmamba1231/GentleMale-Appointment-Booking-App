// apps/api/src/middlewares/auth.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/tokens';
import type { AuthUser } from '../types/express';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.get('authorization');
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  try {
    const { payload } = await verifyAccessToken(h.slice(7));
    const user: AuthUser = {
      id: String(payload.sub),
      role: String(payload.role) as AuthUser['role'],
      sessionId: String(payload.jti ?? ''), // or attach your own session id
    };
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
