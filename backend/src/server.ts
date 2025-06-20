import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import "./config/passport";
import { redisClient } from "./config/redis";
import { ensureAuthenticated } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import shareRoutes from "./routes/share.routes";
import userRoutes from "./routes/user.route";
import suggestionsRoutes from "./routes/suggestions.routes";
import { env } from "./config/env";
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [env.CLIENT_ORIGIN];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err: any) => {
  console.error("❌ Redis error:", err);
});

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/message", ensureAuthenticated, messageRoutes);
app.use("/api/user", ensureAuthenticated, userRoutes);
app.use("/api/share", shareRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
