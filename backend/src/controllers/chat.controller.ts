import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { Request, Response } from "express";
import {
  addOrRemoveArchiveService,
  addOrRemoveFavoriteService,
  deleteChatService,
  findChatById as findChatByIdService,
  findChatNamesByService,
  findChatsByService,
  findShareById,
  renameChatService,
  saveChat,
} from "../services/chat.service";
import { encryptMessage, decryptMessage } from "../utils/encryption.utils";

interface ChatRequestParams {
  chatId: string;
}

interface ChatRequestByshareIdParams {
  shareId: string;
}

export const streamChat = async (req: any, res: any) => {
  const userId = (req.user as { id: string }).id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const chatId = req.body.chatId;
  const encryptedMessages = req.body.messages || [];
  const userMessageId = req.body.userMessageId;
  const assistantMessageId = req.body.assistantMessageId;
  const encryptedPrompt = req.body.prompt;
  let assistantReply = "";

  const model = google("gemini-2.0-flash");
  const decryptedMessages = await Promise.all(
    encryptedMessages.map(async (m: { content: string }) => ({
      ...m,
      content: await decryptMessage(m.content),
    }))
  );

  // Decrypt prompt also
  const decryptedPrompt = await decryptMessage(encryptedPrompt);
  try {
    const result = streamText({
      model,
      messages: [...decryptedMessages, { role: "user", content: decryptedPrompt }],
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          assistantReply += chunk.textDelta;
        }
      },
      onFinish: async () => {
        const encryptedUserMsg = await encryptMessage(decryptedPrompt);
        const encryptedAssistantMsg = await encryptMessage(assistantReply);
        await saveChat(
          userId,
          [
            { id: userMessageId, role: "user", content: encryptedUserMsg },
            { id: assistantMessageId, role: "assistant", content: encryptedAssistantMsg },
          ],
          chatId
        );
      },
      onError: (err) => console.error("Stream error:", err),
    });
    result.pipeTextStreamToResponse(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};

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

export async function findChatByshareId(
  req: Request<ChatRequestByshareIdParams>,
  res: Response
) {
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

export async function findChatsByUsrerId(
  req: Request<ChatRequestParams>,
  res: Response
) {
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

export async function findChatNamesByUserId(
  req: Request<ChatRequestParams>,
  res: Response
) {
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

export const addOrRemoveFavorite = async (req: any, res: any) => {
  const { chatId } = req.params;

  try {
    const updatedChat = await addOrRemoveFavoriteService(chatId);
    return res
      .status(200)
      .json({ message: "Favorite status updated", chat: updatedChat });
  } catch (err: any) {
    if (err.message === "Chat not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error updating favorite:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addOrRemoveArchive = async (req: any, res: any) => {
  const { chatId } = req.params;

  try {
    const updatedChat = await addOrRemoveArchiveService(chatId);
    return res
      .status(200)
      .json({ message: "Archive status updated", chat: updatedChat });
  } catch (err: any) {
    if (err.message === "Chat not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error updating archive:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteChat = async (req: any, res: any) => {
  const { chatId } = req.params;
  const userId = (req.user as { id: string }).id;

  try {
    await deleteChatService(chatId, userId);
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting chat:", err);
    if (err.message === "Chat not found") {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const renameChat = async (req: any, res: any) => {
  const { chatId } = req.params;
  const { newName } = req.body;

  if (!newName || typeof newName !== "string") {
    return res.status(400).json({ error: "New name is required" });
  }

  try {
    const updatedChat = await renameChatService(chatId, newName.trim());
    return res
      .status(200)
      .json({ message: "Chat renamed successfully", chat: updatedChat });
  } catch (err: any) {
    if (err.message === "Chat not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error renaming chat:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
