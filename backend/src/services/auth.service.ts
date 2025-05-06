import { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword } from "../utils/password.util";
import { signToken } from "../utils/token.util";
import * as userRepo from "../repositories/user.repository";
import passport, { use } from "passport";

interface RegisterDTO {
  email: string;
  password: string;
}
interface LoginDTO {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password }: RegisterDTO) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already in use");
  const hashed = await hashPassword(password);
  const user = await userRepo.createUser({ email, password: hashed });
  return { id: user.id, email: user.email };
};

export const loginUser = async ({ email, password }: LoginDTO) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  const token = signToken({ userId: user.id });
  return { user: { id: user.id, email: user.email }, token };
};

// Google OAuth handlers
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", (err: any, user: any) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
    const token = signToken({ userId: (user as any).id });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  })(req, res, next);
};
