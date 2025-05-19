import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  CLIENT_ORIGIN: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  JWT_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
});

export const env = envSchema.parse(process.env);
