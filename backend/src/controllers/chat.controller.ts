import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import {
  saveChat,
  findChatById as findChatByIdService,
} from "../services/chat.service";

export const streamChat = async (req: any, res: any) => {
  const userId = req.user.id;
  const chatId = req.body.chatId;
  const messages = req.body.messages || [];
  let assistantReply = "";

  const model = google("gemini-2.0-flash");

  try {
    const result = streamText({
      model,

      messages: [...messages, { role: "user", content: req.body.prompt }],

      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          assistantReply += chunk.textDelta;
        }
      },

      onFinish: async ({ text, response }) => {
        const allMessages = [
          ...messages,
          { role: "user", content: req.body.prompt },
          { role: "assistant", content: assistantReply },
        ];

        await saveChat(userId, allMessages, chatId);
      },

      onError: (err) => console.error("Stream error:", err),
    });
    result.pipeTextStreamToResponse(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};

import { Request, Response } from "express";

interface ChatRequestParams {
  chatId: string;
}

export async function findChatById(
  req: Request<ChatRequestParams>,
  res: Response
) {
  try {
    const { chatId } = req.params;
    const chat = await findChatByIdService(chatId);
    res.status(200).json(chat);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch chat";
    res.status(404).json({ message: errorMessage });
  }
}
