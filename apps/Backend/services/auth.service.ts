import { db } from "db/client"; 
import { hashPassword, verifyPassword, newRefreshToken, signAccessJwt } from "../utils/crypto";
import { env } from "../utils/env";
import { sendEmail, generateOTP } from "../utils/utils";


export async function register(input: { email: string; password: string; name?: string; phone?: string }) {
  try{const exists = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
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
      OTP: otp,
      OTP_expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    },
    include: { roles: true }
  });
  await sendEmail("Welcome to Gentlemale App! Your One Time Password is" + otp + ". This OTP is valid for 5 minutes.", user.email, "Welcome to Gentlemale App, Here is your One Time Password");
  return { user: { id: user.id, email: user.email, roles: user.roles.map(r => r.role) } };
  }catch(err){
    throw err;
  }
}

export async function verify(input: { email: string; otp: string }) {
  const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if(user.OTP_expiresAt && new Date() > user.OTP_expiresAt) throw new Error("OTP IS EXPIRED");
  if (user.OTP !== input.otp) throw new Error("INVALID_OTP");
  
  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: true, OTP: null }
  });

  return { message: "Email verified successfully" };
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
  if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");
  const ok = await verifyPassword(user.credentials.passwordHash, input.password);
  if (!ok) throw new Error("BAD_CREDENTIALS");

  const accessToken = await signAccessJwt({ sub: user.id }, env.JWT_EXPIRES_IN);
  const { token: refreshRaw, hash: refreshHash, expiresAt } = await newRefreshToken(env.REFRESH_EXPIRES_IN);

  const session = await db.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      ip: req.ip ?? null,
      createdAt: new Date(),
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
