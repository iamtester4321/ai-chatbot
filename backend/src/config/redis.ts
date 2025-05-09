import { env } from "../config/env";

import Redis from "ioredis";

export const redisClient = new Redis(env.REDIS_URL);
