import { RequestHandler, Request } from "express";

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      user?: User;
    }
  }
}
import { verifyToken } from "../utils/token.util";

type User = { id: string };

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  const token = req.cookies?.authToken as string | undefined;

  if (!token) {
    console.log("Token missing");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyToken(token);

    if (!payload || typeof payload !== "object" || !("userId" in payload)) {
      console.log("Token payload invalid");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = { id: (payload as any).userId };

    if (!req.user.id || typeof req.user.id !== "string") {
      console.log("Invalid user ID in token");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    next();
  } catch (err) {
    console.log("Token invalid:", err);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};
