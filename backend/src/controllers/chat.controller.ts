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
import { chartPrompt } from "../lib/prompts/chartPrompt";
import { createChatFromSourceChat } from "../repositories/chat.repository";

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
  const sourceChatId = req.body.sourceChatId;
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

  if (mode === "chart") {
    messages = [
      {
        role: "system",
        content: chartPrompt,
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

  const validRoles = new Set(["user", "assistant", "system"]);
  const promptMessages = messages
    .filter((m) => validRoles.has(m.role) && typeof m.content === "string")
    .map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

  try {
    const result = streamText({
      model,
      messages: promptMessages,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          assistantReply += chunk.textDelta;
        }
      },
      onFinish: async () => {
        if (userId) {
          const encryptedUserMsg = await encryptMessage(decryptedPrompt);
          const encryptedAssistantMsg = await encryptMessage(assistantReply);
          await saveChat(
            userId,
            [
              {
                id: userMessageId,
                role: "user",
                content: encryptedUserMsg,
                for: mode === "chart" ? "chart" : "chat",
              },
              {
                id: assistantMessageId,
                role: "assistant",
                content: encryptedAssistantMsg,
                for: mode === "chart" ? "chart" : "chat",
              },
            ],
            chatId,
            sourceChatId,
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

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as { id: string })?.id;
  const { messages, chatId, sourceChatId } = req.body;

  const { mode } = req.query;

  if (!userId || !chatId) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    let encryptedMessages: { id: string; role: string; content: string; for: string }[] = [];

    // If messages array is passed, encrypt them
    if (Array.isArray(messages)) {
      encryptedMessages = await Promise.all(
        messages.map(async (message: { id: string; role: "user" | "assistant"; content: string;}) => {
          const encryptedContent = await encryptMessage(message.content);
          return {
            id: message.id,
            role: message.role,
            content: encryptedContent,
            for: mode === "chart" ? "chart" : "chat",
          };
        })
      );
    }

    await saveChat(userId, encryptedMessages, chatId, sourceChatId);

    res.status(201).json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});


export const handleCreateChatFromSource = async (req: any, res: any) => {
  const userId = req.user?.id; // Ensure this is being set by your auth middleware
  const newChatId = req.params.chatId;
  const sourceChatId = req.body.sourceChatId;

  if (!userId || !sourceChatId) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  const result = await createChatFromSourceChat(userId, newChatId, sourceChatId);

  if (result.success) {
    return res.status(201).json({ success: true });
  } else {
    return res.status(500).json({ success: false, error: result.error });
  }
};


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

// export const handleCreateChatFromSource = async (req: any, res: any) => {
//   const userId = req.user?.id;
//   const newChatId = req.params.chatId;
//   const sourceChatId = req.body.sourceChatId;

//   if (!userId || !sourceChatId) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Missing required fields." });
//   }

//   const result = await createChatFromSourceChat(
//     userId,
//     newChatId,
//     sourceChatId
//   );

//   if (result.success) {
//     return res.status(201).json({ success: true });
//   } else {
//     return res.status(500).json({ success: false, error: result.error });
//   }
// };
