import { db } from "db/client"; 
import { hashPassword, verifyPassword, newRefreshToken, signAccessJwt } from "../utils/crypto";
import { env } from "../utils/env";
import { sendEmail, generateOTP } from "../utils/utils";


export async function register(input: { email: string; password: string; name?: string; phone?: string }) {
  const exists = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (exists) throw new Error("EMAIL_EXISTS");

  const passwordHash = await hashPassword(input.password);
  const otp = generateOTP();

  const user = await db.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name ?? null,
      credentials: { create: { passwordHash } },
      roles: { create: { role: "CUSTOMER" } },
      phoneE164: input.phone ?? null,
      phoneVerified: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      OTP: otp
    },
    include: { roles: true }
  });
  await sendEmail("Welcome to Gentlemale App! Your One Time Password is" + otp, user.email, "Welcome to Gentlemale App, Here is your One Time Password");
  
  return { user: { id: user.id, email: user.email, roles: user.roles.map(r => r.role) } };
}

export async function login(
  input: { email: string; password: string },
  req: { ip?: string; headers: any }
) {
  const user = await db.user.findUnique({
    where: { email: input.email.toLowerCase() },
    include: { credentials: true }
  });
  if (!user || !user.credentials) throw new Error("BAD_CREDENTIALS");

  const ok = await verifyPassword(user.credentials.passwordHash, input.password);
  if (!ok) throw new Error("BAD_CREDENTIALS");

  const accessToken = await signAccessJwt({ sub: user.id }, env.JWT_EXPIRES_IN);
  const { token: refreshRaw, hash: refreshHash, expiresAt } = await newRefreshToken(env.REFRESH_EXPIRES_IN);

  const session = await db.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      ip: req.ip ?? null,
      expiresAt
    }
  });

  return { accessToken, refreshToken: refreshRaw, sessionId: session.id };
}

export async function refresh(input: { refreshToken: string; sessionId: string }) {
  const session = await db.session.findUnique({ where: { id: input.sessionId }, include: { user: true } });
  if (!session || !session.refreshTokenHash) throw new Error("INVALID_SESSION");

  const valid = await import("../utils/crypto").then(m => m.verifyRefresh(session.refreshTokenHash!, input.refreshToken));
  if (!valid || new Date() > session.expiresAt) throw new Error("REFRESH_EXPIRED");

  const accessToken = await signAccessJwt({ sub: session.userId }, env.JWT_EXPIRES_IN);
  return { accessToken };
}

export async function logout(sessionId: string) {
  await db.session.delete({ where: { id: sessionId } });
}
