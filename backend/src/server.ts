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

app.use("/api/auth", authRoutes);
app.use("/api/chats", ensureAuthenticated, chatRoutes);

app.post("/api/stream", async (req: any, res: any) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  const model = google("gemini-2.0-flash");

  const result = streamText({
    model,
    prompt,
    onFinish: () => {
      console.log("Finished streaming");
    },
    onError: (err) => {
      console.log("Stream error", err);
    },
  });

  try {
    const result = streamText({
      model,
      prompt,
      onFinish: (response) => {
        // console.log('Stream finished:', response);
      },
      onError: (err) => {
        console.error('Stream error:', err);
      }
    });

    result.pipeTextStreamToResponse(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/api/stream", async (req: any, res: any) => {
  const messages = req.body.messages;
  const prompt = req.body.prompt || messages?.[messages.length - 1]?.content;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const model = google("gemini-2.0-flash");

  try {
    const result = streamText({
      model,
      prompt,
      onFinish: () => {},
      onError: (err) => {
        console.error('Stream error:', err);
      },
    });

    result.pipeTextStreamToResponse(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
