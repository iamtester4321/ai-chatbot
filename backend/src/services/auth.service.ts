import { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as userRepo from "../repositories/user.repository";
import { comparePassword, hashPassword } from "../utils/password.util";
import { signToken } from "../utils/token.util";
import { env } from "../config/env";

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
      return {
        success: false,
        message: "User already exists",
      };
    }
    const hashed = await hashPassword(password);
    const user = await userRepo.createUser({ email, password: hashed });

    const token = signToken({ userId: user.id, email: user.email });

    return { success: true, data: { id: user.id, email: user.email }, token };
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

    const valid = !user.password
      ? false
      : await comparePassword(password, user.password);
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
  passport.authenticate("google", async (err: any, googleUser: any) => {
    if (err) return next(err);
    if (!googleUser) return res.redirect(`${env.CLIENT_ORIGIN}/login`);

    try {
      let user = await userRepo.findByEmail(googleUser.email);

      let token = null;
      if (user) token = signToken({ userId: user.id, email: user.email });

      const temp = new URL(env.SERVER_ORIGIN);
      const domain = temp.hostname;

      const isDevlopment = env.NODE_ENV.includes("dev");

      let cocckieOpt = {
        httpOnly: true,
        secure: !isDevlopment,
        sameSite: (isDevlopment ? "lax" : "none") as "lax" | "none" | "strict",
        ...(isDevlopment ? {} : { domain: domain }),
      };

      res.cookie("authToken", token, cocckieOpt);

      res.redirect(`${env.CLIENT_ORIGIN}`);
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect(`${env.CLIENT_ORIGIN}/login?error=oauth_failed`);
    }
  })(req, res, next);
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
