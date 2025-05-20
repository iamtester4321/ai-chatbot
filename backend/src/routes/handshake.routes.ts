import { Router } from "express";
import {
  SERVER_PUBKEY_BASE64,
  deriveAesKeyFromClientPub,
} from "../config/crypto";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "express-session";

declare module "express-session" {
  interface SessionData {
    aesKey?: string;
  }
}

const router = Router();

router.post(
  "/",
  asyncHandler((req: Request, res: Response) => {
    const { clientPubkey } = req.body as { clientPubkey: string };
    if (!clientPubkey) {
      res.status(400).send("Missing clientPubkey");
      return;
    }

    // Derive the AES key buffer from the client’s public key
    const aesKey = deriveAesKeyFromClientPub(clientPubkey);

    // Store it in session
    req.session.aesKey = aesKey.toString("base64");

    res.json({ serverPubkey: SERVER_PUBKEY_BASE64 });
  })
);

export default router;
