import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number(),
  REFRESH_EXPIRES_IN: z.coerce.number(),
  EMAIL: z.string().email().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  OTP_SECRET: z.string().optional(),
  jwtIssuer: z.string().default("gentlemale"),
  jwtAudience: z.string().default("gentlemale"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
