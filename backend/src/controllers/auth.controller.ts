import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { env } from "../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser({ email, password });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    const temp = new URL(env.SERVER_ORIGIN);
    const domain = temp.hostname;

    const isDevlopment = env.NODE_ENV.includes("dev");

    let cocckieOpt = {
      httpOnly: true,
      secure: !isDevlopment,
      sameSite: (isDevlopment ? "lax" : "none") as "lax" | "none" | "strict",
      ...(isDevlopment ? {} : { domain: domain }),
    };

    if (!result.token) {
      res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
      return;
    }

    res.cookie("authToken", result.token, cocckieOpt);

    res.status(201).json({ success: true, user: result.data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    const temp = new URL(env.SERVER_ORIGIN);
    const domain = temp.hostname;

    const isDevlopment = env.NODE_ENV.includes("dev");

    let cocckieOpt = {
      httpOnly: true,
      secure: !isDevlopment,
      sameSite: (isDevlopment ? "lax" : "none") as "lax" | "none" | "strict",
      ...(isDevlopment ? {} : { domain: domain }),
    };

    res.cookie("authToken", result.data?.token, cocckieOpt);
    res.json({ success: true, user: result.data?.user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Login failed",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  const temp = new URL(env.SERVER_ORIGIN);
  const domain = temp.hostname;

  const isDevlopment = env.NODE_ENV.includes("dev");

  const cookieOptions = {
    httpOnly: true,
    secure: !isDevlopment,
    sameSite: (isDevlopment ? "lax" : "none") as "lax" | "none" | "strict",
    ...(isDevlopment ? {} : { domain }),
    path: "/",
  };

  res.clearCookie("authToken", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out" });
};

export const googleAuth = authService.googleAuth;
export const googleCallback = authService.googleCallback;
