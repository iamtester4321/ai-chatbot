import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import "./config/passport";
import { ensureAuthenticated } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", ensureAuthenticated, chatRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
