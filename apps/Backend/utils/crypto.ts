import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "./env";
import crypto from "crypto";

export const hashPassword = (pwd: string) => argon2.hash(pwd, { type: argon2.argon2id });
export const verifyPassword = (hash: string, pwd: string) => argon2.verify(hash, pwd);

export function signAccessJwt(payload: object, expiresIn: number) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export async function newRefreshToken(expires: number) {
  const token = crypto.randomBytes(64).toString("hex");
  const hash = await argon2.hash(token, { type: argon2.argon2id });
  const expiresAt = new Date(Date.now() + expires);
  return { token, hash, expiresAt };
}

export const verifyRefresh = (hash: string, token: string) => argon2.verify(hash, token);
