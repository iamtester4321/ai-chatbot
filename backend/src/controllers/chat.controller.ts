import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { Request, RequestHandler, Response } from "express";
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

interface ChatRequestByshareIdParams {
  shareId: string;
  user: { id: string };
}

export const streamChat = async (req: any, res: any) => {
  const userId = (req.user as { id: string })?.id;
  const chatId = req.body.chatId;
  const messages = req.body.messages || [];
  const userMessageId = req.body.userMessageId;
  const assistantMessageId = req.body.assistantMessageId;
  let assistantReply = "";

  const { mode } = req.query;

  let tempPrompt =
    req.body.prompt ||
    "user forget to put prompt || if chat type is chart show return some rutin data ";

  if (mode === "chart") {
    tempPrompt =
      `
You are a data analysis assistant. Your response must include detailed observations or explanations alongside one or more valid JSON objects. Each JSON object must be parseable by JSON.parse() and clearly labeled with a name indicating its purpose or type (e.g., "MonthlyRevenue", "UserGrowth", etc.).

✅ JSON must:
- Be suitable for visualizing with charts (line, bar, pie, stacked, scatter, area, composed)
- Include arrays of data (e.g., labels and corresponding values)
- Be named when multiple datasets are returned (e.g., {"name": "MonthlyRevenue", "data": {...}})
- Be parseable and not wrapped in backticks or markdown
- Be accompanied by text that describes or analyzes the data
s
Your response format:
1. Explanatory text describing the data, trends, insights, and relationships.
2. One named JSON objects, each on its own line.
3. Give all data in data filed of json.
4. Don't add any other data field in data field of json.

Now return the data and explanation for the following request:
` + req.body.prompt.trim();
  } else tempPrompt = tempPrompt;

  const model = google("gemini-2.0-flash");

  try {
    const result = streamText({
      model,
      messages: [...messages, { role: "user", content: tempPrompt }],
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          assistantReply += chunk.textDelta;
        }
      },
      onFinish: async () => {
        if (userId) {
          await saveChat(
            userId,
            [
              { id: userMessageId, role: "user", content: req.body.prompt },
              {
                id: assistantMessageId,
                role: "assistant",
                content: assistantReply,
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
};

export const findChatById: RequestHandler = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await findChatByIdService(chatId);
    res.status(200).json(chat);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch chat";
    res.status(404).json({ message: errorMessage });
  }
};

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

export const findChatsForUser: RequestHandler = async (req, res) => {
  try {
    const userId = (req.user as { id: string }).id;
    const chats = await findChatsByService(userId);
    res.status(200).json(chats);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch chats";
    res.status(404).json({ message: errorMessage });
  }
};

export const findChatNamesByUserId: RequestHandler = async (req, res) => {
  try {
    const userId = (req.user as { id: string }).id;
    const chatNames = await findChatNamesByService(userId);
    res.status(200).json(chatNames);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch chat names";
    res.status(404).json({ message: errorMessage });
  }
};

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
