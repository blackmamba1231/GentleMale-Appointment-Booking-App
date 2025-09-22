import { db } from "db/client"; 
import { hashPassword, verifyPassword, newRefreshToken, signAccessJwt } from "../utils/crypto";
import { env } from "../utils/env";
import { sendEmail, generateOTP } from "../utils/utils";
import axios from "axios";

export async function me(req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
  const user = await db.user.findUnique({ where: { id: req.user?.id } });
  if(!user) throw new Error("User not found");
  return { user: { id: user.id, email: user.email, role: req.user?.role as 'CUSTOMER' | 'STYLIST' | 'ADMIN', phone: user.phoneE164, name: user.name , avatarUrl: user.avatarUrl } };
}

export async function register(input: { email: string; password: string; name?: string; phone?: string }) {
  const exists = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  const verified = await db.user.findFirst({
  where: {
    email: input.email.toLowerCase(),
    emailVerified: true
  }
  });

  if (verified){
    throw new Error("User already exists");
  }
  
  const passwordHash = await hashPassword(input.password);
  const otp = generateOTP();
  if(exists && !verified){
    const findUser = await db.user.findFirst({
      where: {
        email: input.email.toLowerCase(),
      }
      });
      if (!findUser) {
        throw new Error('User not found');
      }
      await db.user.update({
        where: { id: findUser.id },
        data: {
          OTP: otp,
          OTP_expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
          name: input.name ?? findUser.name,
          phoneE164: input.phone ?? findUser.phoneE164,
          email: input.email.toLowerCase(),
          credentials: {
            upsert: {
              update: { passwordHash },
              create: { passwordHash }
            }
          },
          updatedAt: new Date()
        }});
    await sendEmail("Welcome to Gentlemale App! Your One Time Password is : " + otp + ". This OTP is valid for 5 minutes.", findUser.email, "Welcome to Gentlemale App, Here is your One Time Password");
    return { user: { id: findUser.id, email: findUser.email }}
  }
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
  return { user: { id: user.id, email: user.email } };
}

export async function verify(input: { email: string; otp: string }) {
  const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user) throw new Error("User Not Found");
  if(user.OTP_expiresAt && new Date() > user.OTP_expiresAt) throw new Error("OTP IS EXPIRED");
  if (user.OTP !== input.otp) throw new Error("Invalid OTP");
  
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
  if (!user || !user.credentials) throw new Error("Bad Credentials");
  if (!user.emailVerified) throw new Error("Email Not verified");
  const ok = await verifyPassword(user.credentials.passwordHash, input.password);
  if (!ok) throw new Error("Bad Credentials");
  const { token: refreshRaw, hash: refreshHash, expiresAt: expiresAt } = await newRefreshToken(env.REFRESH_EXPIRES_IN);
  const alreadySessions = await db.session.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  if (alreadySessions.length >= 5) {
    await db.session.delete({ where: { id: alreadySessions[0]!.id } });
  }
  const session = await db.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      ip: req.ip ?? null,
      createdAt: new Date(),
      expiresAt: expiresAt,
    }
  });
  const accessToken = await signAccessJwt({ sub: user.id, role: "CUSTOMER", jti: session.id}, env.JWT_EXPIRES_IN);
  return { accessToken, refreshToken: refreshRaw, sessionId: session.id };
}

export async function refresh(input: { refreshToken: string; sessionId: string }) {
  const session = await db.session.findUnique({ where: { id: input.sessionId }, include: { user: true } });
  if (!session || !session.refreshTokenHash) throw new Error("INVALID SESSION");

  const valid = await import("../utils/crypto").then(m => m.verifyRefresh(session.refreshTokenHash!, input.refreshToken));
  if (!valid || new Date() > session.expiresAt) throw new Error("REFRESH EXPIRED");

  const accessToken = await signAccessJwt({ sub: session.userId ,role: "CUSTOMER", jti: input.sessionId }, env.JWT_EXPIRES_IN);
  return { accessToken };
}

export async function logout(sessionId: string) {
  await db.session.delete({ where: { id: sessionId } });
}
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = env.GOOGLE_REDIRECT_URI;

export const googleOAuthService = {
  
  getGoogleOAuthUrl: () => {
    if (!process.env.REDIRECT_URI || !process.env.CLIENT_ID) {
        throw new Error('Missing required env variables');
   }
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const options = {
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: 'email profile',
    };
    const params = new URLSearchParams(options);
    return `${rootUrl}?${params.toString()}`;
  },

  handleGoogleCallback: async (code: string) => {
    if( !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      throw new Error('Google OAuth not configured');
    }
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { id: googleId, email, name } = userInfoResponse.data;

    if (!email) throw new Error('Google account has no email');

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          emailVerified: true,
          roles: { create: { role: "CUSTOMER" } },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
    }

    const { token: refreshRaw, hash: refreshHash, expiresAt: expiresAt } = await import("../utils/crypto").then(m => m.newRefreshToken(env.REFRESH_EXPIRES_IN));

    const session = await db.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshHash,
        ip: null,
        createdAt: new Date(),
        expiresAt: expiresAt,
      }
    });

    const accessToken = await signAccessJwt({ sub: user.id, role: "CUSTOMER", jti: session.id }, env.JWT_EXPIRES_IN);

    return { accessToken, refreshToken: refreshRaw, sessionId: session.id };
  }

};
