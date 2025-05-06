import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function verifyToken<T = any>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as T;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export function signToken(payload: object, expiresIn: string = "7d"): string {
  const options: any = {
    expiresIn,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}
