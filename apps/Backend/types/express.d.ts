// apps/api/src/types/express.d.ts
import type { Role } from '@salon/shared';

export type AuthUser = {
  id: string;
  role: Role;
  sessionId: string; 
};

export {};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
