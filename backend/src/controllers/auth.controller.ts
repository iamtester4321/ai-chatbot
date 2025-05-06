import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser({ email, password });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    res.cookie("token", token, { httpOnly: true });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

export const googleAuth = authService.googleAuth;
export const googleCallback = authService.googleCallback;
