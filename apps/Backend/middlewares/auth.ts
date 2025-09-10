import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import type { AuthUser } from '../types/express';
import { db } from 'db/client'
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.get('authorization');
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = await verifyAccessToken(h.slice(7));
    if (!payload) return res.status(401).json({ error: "Invalid or expired access token" });
    const session = await db.session.findUnique({
      where: { id: payload.jti }  
    });

    if (!session) {
      return res.status(401).json({ error: 'Session not found' });
    }

    if (new Date() > session.expiresAt) {
      return res.status(401).json({ error: 'Session expired, login again' });
    }

    const user: AuthUser = {
      id: String(payload.sub),
      role: String(payload.role) as AuthUser['role'],
      sessionId: String(payload.jti ?? ''), 
    };
    req.user = user;
    next();
  } catch(err) {
    res.status(401).json({ error: 'Invalid token' + err });
  }
}
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.get('authorization');
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const sessionexists = await db.session.findUnique({
      where: { id: req.body.sessionId }  
    });
    if(!sessionexists) return res.status(401).json({ error: 'Session not found' });
    if (new Date() > sessionexists.expiresAt) {
      return res.status(401).json({ error: 'Session expired, login again' });
    }
    next();
  }catch(err) {
    res.status(401).json({ error: 'Invalid token' + err });
  }
}