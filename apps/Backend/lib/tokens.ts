// apps/api/src/lib/tokens.ts
import * as jose from 'jose';
import { env } from './env';

const alg = env.jwtPublicKey ? 'EdDSA' : 'HS512';


export async function signAccessToken(
  sub: string,
  role: string,
  sessionId?: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(env.accessTtlMs / 1000);

  const payload: Record<string, unknown> = {
    sub,
    role,
    iat: now,
    nbf: now,
    iss: env.jwtIssuer,
    aud: env.jwtAudience,
    exp,
  };
  if (sessionId) payload.jti = sessionId;

  const key = env.jwtPublicKey
    ? await jose.importPKCS8(env.jwtPrivateKey, alg) // asymmetric
    : new TextEncoder().encode(env.jwtPrivateKey);   // symmetric

  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .sign(key);
}


export async function verifyAccessToken(token: string) {
  const key = env.jwtPublicKey
    ? await jose.importSPKI(env.jwtPublicKey, alg)
    : new TextEncoder().encode(env.jwtPrivateKey);

  return jose.jwtVerify(token, key, {
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  });
}
