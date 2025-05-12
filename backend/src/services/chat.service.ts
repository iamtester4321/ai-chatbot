import * as chatRepo from "../repositories/chat.repository";
import { redisClient } from "../config/redis";

const CHAT_CACHE_PREFIX = "chat:";
const USER_CHATS_PREFIX = "user:";

export async function saveChat(
  userId: string,
  messages: { role: string; content: string }[],
  chatId: string
) {
  const result = await chatRepo.createChatWithMessagesOrApendMesages(
    userId,
    messages,
    chatId
  );

  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chats`),
  ]);
  return result;
}

export async function findChatById(chatId: string) {
  const key = `${CHAT_CACHE_PREFIX}${chatId}`;
  const cached = await redisClient.get(key);
  if (cached) {
    console.log("returning cached");
    return JSON.parse(cached);
  } else {
    console.log("returning from db");
  }

  const chat = await chatRepo.findById(chatId);
  await redisClient.set(key, JSON.stringify(chat));
  return chat;
}

export async function findChatsByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chats`;
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const chats = await chatRepo.getChatsByUser(userId);
  await redisClient.set(key, JSON.stringify(chats));
  return chats;
}

export async function findChatNamesByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chat-names`;
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const chatNames = await chatRepo.getChatNamesByUser(userId);
  await redisClient.set(key, JSON.stringify(chatNames));
  return chatNames;
}

export const addOrRemoveFavoriteService = async (chatId: string) => {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const updated = await chatRepo.toggleFavoriteStatus(chatId, chat.isFavorite);
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats`),
  ]);
  return updated;
};

export const addOrRemoveArchiveService = async (chatId: string) => {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const updated = await chatRepo.toggleArchiveStatus(chatId, chat.isArchived);
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats`),
  ]);
  return updated;
};

export const deleteChatService = async (chatId: string, userId: string) => {
  const chat = await chatRepo.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await chatRepo.deleteChatById(chatId);

  // Invalidate cache
  await redisClient.del(`chat:${chatId}`);
  await redisClient.del(`chats:user:${userId}`);
};
