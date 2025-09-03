import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    phone: z.string().min(10).max(15),
  })
});

export const verifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(1).max(10),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const refreshSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    refreshToken: z.string().min(1)
  })
});
