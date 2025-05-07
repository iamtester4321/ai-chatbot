"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = __importDefault(require("zod"));
dotenv_1.default.config();
const envSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string().url(),
    //REDIS_URL: z.string().url(),
    GOOGLE_CLIENT_ID: zod_1.default.string(),
    GOOGLE_CLIENT_SECRET: zod_1.default.string(),
    GOOGLE_CALLBACK_URL: zod_1.default.string().url(),
    GOOGLE_GENERATIVE_AI_API_KEY: zod_1.default.string(),
    JWT_SECRET: zod_1.default.string(),
    SESSION_SECRET: zod_1.default.string(),
    NODE_ENV: zod_1.default
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.default.string().default("3000"),
});
exports.env = envSchema.parse(process.env);
