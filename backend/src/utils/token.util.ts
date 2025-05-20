import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { env } from "../config/env";

interface TokenPayload {
  userId: string;
  email: string;
}

export function verifyToken<T = TokenPayload>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as T;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export function signToken(
  payload: TokenPayload,
  expiresIn: number | StringValue = "7d"
): string {
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}