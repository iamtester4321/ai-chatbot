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
import {
  createAesGcmEncryptStream,
  decryptAesPayload,
  encryptWithAesGcm,
} from "../utils/encryptStream";
import { Readable } from "stream";

interface ChatRequestByshareIdParams {
  shareId: string;
  user: { id: string };
}

export const streamChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as { id: string })?.id;
  const { chatId, messages = [], userMessageId, assistantMessageId } = req.body;

  const aesKey = req.session.aesKey;

  if (!aesKey) {
    res.status(401).send("No encryption key");
    return;
  }
  const aesKeyBuffer = Buffer.from(aesKey, "base64");

  const enPrompt = req.body.prompt;

  const prompt = await decryptAesPayload(enPrompt, aesKeyBuffer);

  const { mode } = req.query;

  let assistantReply = "";
  let tempPrompt = prompt || "user forget to put prompt ...";
  if (mode === "chart") {
    tempPrompt = `
     SYSTEM:
You are a data analysis assistant. When given a query, you must respond only with one or more raw JSON objects or arrays—no markdown, no backticks, no extra text. Each top-level object must include:
- "name": a descriptive string
- "data": an object whose values are arrays of equal length suitable for plotting (e.g., ["Jan","Feb"] and [10,20]).
-you should only return one object as an json and that one object must have name property wich is what that data about and data propery wich is object and it should be able to show on charts
Everything you output must be directly parseable by JSON.parse().

-data must be in an formate and data must be able to project on line,area,bar,compose,sacter,pie this chart *this is must*

USER:${req.body.prompt}
`.trim();
  }

  const model = google("gemini-2.0-flash");
  const result = await streamText({
    model,
    messages: [...messages, { role: "user", content: tempPrompt }],
    onChunk: ({ chunk }) => {
      if (chunk.type === "text-delta") {
        assistantReply += chunk.textDelta;
      }
    },
    onFinish: async () => {
      if (userId) {
        // Import the AES key as CryptoKey

        const encryptedPrompt = encryptWithAesGcm(prompt, aesKeyBuffer);
        const encryptedReply = encryptWithAesGcm(assistantReply, aesKeyBuffer);

        await saveChat(
          userId,
          [
            { id: userMessageId, role: "user", content: encryptedPrompt },
            {
              id: assistantMessageId,
              role: "assistant",
              content: encryptedReply,
            },
          ],
          chatId,
          aesKey
        );
      }
    },
    onError: (err) => console.error("Stream error:", err),
  });

  // Convert AsyncIterable to Node Readable
  const readable = Readable.from(result.textStream);
  const encryptStream = createAesGcmEncryptStream(aesKeyBuffer);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  readable.pipe(encryptStream).pipe(res);
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
