import * as chatRepo from "../repositories/chat.repository";
import { redisClient } from "../config/redis";

const CHAT_CACHE_PREFIX = "chat:";
const USER_CHATS_PREFIX = "user:";
const CHAT_VERSION_PREFIX = "chat_version:";
const USER_VERSION_PREFIX = "user_version:";

async function updateChatVersion(chatId: string) {
  const version = Date.now().toString();
  await redisClient.set(`${CHAT_VERSION_PREFIX}${chatId}`, version);
  return version;
}

async function updateUserVersion(userId: string) {
  const version = Date.now().toString();
  await redisClient.set(`${USER_VERSION_PREFIX}${userId}`, version);
  return version;
}

async function getChatVersion(chatId: string) {
  return await redisClient.get(`${CHAT_VERSION_PREFIX}${chatId}`);
}

async function getUserVersion(userId: string) {
  return await redisClient.get(`${USER_VERSION_PREFIX}${userId}`);
}

export async function saveChat(
  userId: string,
  messages: { id: string; role: string; content: string }[],
  chatId: string
) {
  const result = await chatRepo.createChatWithMessagesOrApendMesages(
    userId,
    messages,
    chatId
  );

  // Update versions and clear caches
  await Promise.all([
    updateChatVersion(chatId),
    updateUserVersion(userId),
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chats`),
  ]);
  return result;
}

export async function findChatById(chatId: string) {
  const key = `${CHAT_CACHE_PREFIX}${chatId}`;
  const cached = await redisClient.get(key);
  const currentVersion = await getChatVersion(chatId);
  
  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  // Only fetch from DB if cache is invalid or missing
  const dbChat = await chatRepo.findById(chatId);
  
  if (dbChat) {
    const version = await updateChatVersion(chatId);
    await redisClient.set(key, JSON.stringify({
      _version: version,
      data: dbChat
    }));
  }
  return dbChat;
}

export async function findChatsByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chats`;
  const cached = await redisClient.get(key);
  const currentVersion = await getUserVersion(userId);
  
  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  // Only fetch from DB if cache is invalid or missing
  const dbChats = await chatRepo.getChatsByUser(userId);
  
  const version = await updateUserVersion(userId);
  await redisClient.set(key, JSON.stringify({
    _version: version,
    data: dbChats
  }));
  return dbChats;
}

export async function findChatNamesByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chat-names`;
  const cached = await redisClient.get(key);
  const currentVersion = await getUserVersion(userId);
  
  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  // Only fetch from DB if cache is invalid or missing
  const dbChatNames = await chatRepo.getChatNamesByUser(userId);
  
  const version = await updateUserVersion(userId);
  await redisClient.set(key, JSON.stringify({
    _version: version,
    data: dbChatNames
  }));
  return dbChatNames;
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
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats}`),
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
  
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chats`),
  ]);
};

export const renameChatService = async (chatId: string, newName: string) => {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const updated = await chatRepo.renameChat(chatId, newName);
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chat-names`),
  ]);
  return updated;
};
