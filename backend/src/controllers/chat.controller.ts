import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  addOrRemoveArchiveService,
  addOrRemoveFavoriteService,
  deleteChatService,
  findChatById as findChatByIdService,
  findChatNamesByService,
  findChatsByService,
  renameChatService,
  saveChat,
} from "../services/chat.service";
import { findShareById } from "../services/share.service";
import { decryptMessage, encryptMessage } from "../utils/encryption.utils";

interface ChatRequestParams {
  chatId: string;
}

interface ChatRequestByshareIdParams {
  shareId: string;
  user: { id: string };
}

export const streamChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as { id: string })?.id;
  const chatId = req.body.chatId;
  const encryptedMessages = req.body.messages || [];
  const userMessageId = req.body.userMessageId;
  const assistantMessageId = req.body.assistantMessageId;
  const encryptedPrompt = req.body.prompt;
  let assistantReply = "";

  const { mode } = req.query;

  let messages = await Promise.all(
    encryptedMessages.map(async (m: { content: string; role: string }) => ({
      role: m.role,
      content: await decryptMessage(m.content),
    }))
  );

  // Decrypt prompt
  const decryptedPrompt = await decryptMessage(encryptedPrompt);

  // Handle chart mode differently
  if (mode === "chart") {
    // Clear previous messages for chart mode to ensure clean JSON response
    messages = [
      {
        role: "system",
        content: `You are a data analysis assistant. When given a query, respond only with one raw JSON object that includes:
- "name": a descriptive string
- "data": an object with arrays of equal length suitable for plotting
Your response must be directly parseable by JSON.parse() with no extra text.`,
      },
      {
        role: "user",
        content: decryptedPrompt,
      },
    ];
  } else {
    // Normal mode
    messages.push({
      role: "user",
      content: decryptedPrompt,
    });
  }

  const model = google("gemini-2.0-flash");

  try {
    const result = streamText({
      model,
      messages,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          assistantReply += chunk.textDelta;
        }
      },
      onFinish: async () => {
        // For chart mode, validate the JSON
        if (mode === "chart") {
          try {
            JSON.parse(assistantReply);
          } catch (e) {
            // If not valid JSON, generate a fallback response
          }
        }
        if (userId) {
          const encryptedUserMsg = await encryptMessage(decryptedPrompt);
          const encryptedAssistantMsg = await encryptMessage(assistantReply);
          await saveChat(
            userId,
            [
              { id: userMessageId, role: "user", content: encryptedUserMsg },
              {
                id: assistantMessageId,
                role: "assistant",
                content: encryptedAssistantMsg,
              },
            ],
            chatId
          );
        }
      },
      onError: (err) => console.error("Stream error:", err),
    });
    result.pipeTextStreamToResponse(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

export const findChatById: RequestHandler = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await findChatByIdService(chatId);
    res.status(200).json(chat);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch chat";
    res.status(404).json({ message: errorMessage });
  }
});

export const findChatByshareId = asyncHandler(
  async (req: Request<ChatRequestByshareIdParams>, res: Response) => {
    try {
      const { shareId } = req.params;
      const chat = await findShareById(shareId);
      res.status(200).json(chat);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch chat";
      res.status(404).json({ message: errorMessage });
    }
  }
);

export const findChatsForUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = (req.user as { id: string }).id;
      const chats = await findChatsByService(userId);
      res.status(200).json(chats);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch chats";
      res.status(404).json({ message: errorMessage });
    }
  }
);

export const findChatNamesByUserId: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = (req.user as { id: string }).id;
      const chatNames = await findChatNamesByService(userId);
      res.status(200).json(chatNames);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch chat names";
      res.status(404).json({ message: errorMessage });
    }
  }
);

export const addOrRemoveFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    try {
      const updatedChat = await addOrRemoveFavoriteService(chatId);
      res
        .status(200)
        .json({ message: "Favorite status updated", chat: updatedChat });
    } catch (err: any) {
      if (err.message === "Chat not found") {
        res.status(404).json({ error: err.message });
      }
      console.error("Error updating favorite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const addOrRemoveArchive = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    try {
      const updatedChat = await addOrRemoveArchiveService(chatId);
      res
        .status(200)
        .json({ message: "Archive status updated", chat: updatedChat });
    } catch (err: any) {
      if (err.message === "Chat not found") {
        res.status(404).json({ error: err.message });
      } else {
        console.error("Error updating archive:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
);

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const userId = (req.user as { id: string }).id;

  try {
    await deleteChatService(chatId, userId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting chat:", err);
    if (err.message === "Chat not found") {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export const renameChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { newName } = req.body;

  if (!newName || typeof newName !== "string") {
    res.status(400).json({ error: "New name is required" });
    return;
  }

  try {
    const updatedChat = await renameChatService(chatId, newName.trim());
    res
      .status(200)
      .json({ message: "Chat renamed successfully", chat: updatedChat });
  } catch (err: any) {
    if (err.message === "Chat not found") {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error("Error renaming chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
