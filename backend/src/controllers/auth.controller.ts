import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser({ email, password });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.cookie("authToken", result?.token, { httpOnly: true });
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

    res.cookie("authToken", result.data?.token, { httpOnly: true });
    res.json({ success: true, user: result.data?.user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Login failed",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logged out" });
};

export const googleAuth = authService.googleAuth;
export const googleCallback = authService.googleCallback;
