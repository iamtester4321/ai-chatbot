import { Request, Response, NextFunction, RequestHandler } from "express";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
import { verifyToken } from "../utils/token.util";

// Define the User type
type User = { id: string };

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  const token = req.cookies.token as string | undefined;

  if (!token) {
    console.log("Token missing");
    res.status(401).json({ error: "Unauthorized" });
    return; // ← return void, not `return res…`
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: (payload as any).userId };
    next(); // ← call next() and return void
  } catch (err) {
    console.log("Token invalid:", err);
    res.status(401).json({ error: "Unauthorized" });
    return; // ← again return void
  }
};
