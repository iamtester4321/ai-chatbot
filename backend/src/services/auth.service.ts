import { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as userRepo from "../repositories/user.repository";
import { comparePassword, hashPassword } from "../utils/password.util";
import { signToken } from "../utils/token.util";

interface RegisterDTO {
  email: string;
  password: string;
}
interface LoginDTO {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password }: RegisterDTO) => {
  try {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new Error("User already exists");
    }
    const hashed = await hashPassword(password);
    const user = await userRepo.createUser({ email, password: hashed });
    return { success: true, data: { id: user.id, email: user.email } };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const loginUser = async ({ email, password }: LoginDTO) => {
  try {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "User not exists",
      };
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const token = signToken({ userId: user.id, email: user.email });
    return {
      success: true,
      data: { user: { id: user.id, email: user.email }, token },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    passport.authenticate("google", (err: any, user: any) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");
      const token = signToken({ userId: user.id, email: user.email });
      res.cookie("authToken", token, { httpOnly: true });
      res.redirect("/");
    })(req, res, next);
  } catch (error) {
    res.redirect("/login?error=auth_failed");
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
