import "./config/passport";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";

import { ensureAuthenticated } from "./middlewares/auth.middleware";

/* ------- */
import { google } from "@ai-sdk/google"; // 1️⃣
import { streamText } from "ai";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chats", ensureAuthenticated, chatRoutes);

app.post("/api/strem", async (req: any, res: any) => {
  const { prompt } = req.body;
  const model = google("gemini-2.0-flash");

  const result = streamText({
    model,
    prompt,
    onFinish: (res) => {
      console.log("heloo");
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  result.pipeTextStreamToResponse(res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
