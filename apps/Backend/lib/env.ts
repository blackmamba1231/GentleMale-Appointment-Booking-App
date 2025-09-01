import 'dotenv/config';
import ms from 'ms';
import type { StringValue } from 'ms';

const toMs = (s: string): number => {
  const v = ms(s as StringValue);
  if (typeof v !== 'number') {
    throw new Error(`Invalid duration string: "${s}" (expected like "15m", "30d", "1h")`);
  }
  return v;
};

export const env = {
  // Server
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  // Token lifetimes
  accessTtlMs: toMs(process.env.ACCESS_TOKEN_TTL ?? '15m'),
  refreshTtlMs: toMs(process.env.REFRESH_TOKEN_TTL ?? '30d'),

  // JWT claims
  jwtIssuer: process.env.JWT_ISSUER ?? 'salon.app',
  jwtAudience: process.env.JWT_AUDIENCE ?? 'salon.mobile',

  // JWT keys (HS512 if public is empty; EdDSA if both set)
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || '',
  jwtPublicKey: process.env.JWT_PUBLIC_KEY || undefined,
};
