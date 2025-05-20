import { redisClient } from "../config/redis";
import {
  CHAT_CACHE_PREFIX,
  CHAT_VERSION_PREFIX,
  USER_CHATS_PREFIX,
  USER_VERSION_PREFIX,
} from "../constants/redisKeys";
import * as chatRepo from "../repositories/chat.repository";
import { generateExpiration, updateChatVersion, updateUserVersion } from "../utils/cache.utils";

export async function saveChat(
  userId: string,
  messages: { id: string; role: string; content: string }[],
  chatId: string,
  aesKey: string
) {
  const result = await chatRepo.createChatWithMessagesOrApendMesages(
    userId,
    messages,
    chatId,
    aesKey
  );

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
  const versionKey = `${CHAT_VERSION_PREFIX}${chatId}`;

  const [cached, currentVersion] = await Promise.all([
    redisClient.get(key),
    redisClient.get(versionKey),
  ]);

  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  const dbChat = await chatRepo.findById(chatId);
  if (dbChat) {
    const version = Date.now().toString();
    await Promise.all([
      redisClient.set(versionKey, version),
      redisClient.set(
        key,
        JSON.stringify({ _version: version, data: dbChat }),
        "EX",
        generateExpiration()
      ),
    ]);
  }

  return dbChat;
}

export async function findChatsByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chats`;
  const versionKey = `${USER_VERSION_PREFIX}${userId}`;

  const [cached, currentVersion] = await Promise.all([
    redisClient.get(key),
    redisClient.get(versionKey),
  ]);

  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  const dbChats = await chatRepo.getChatsByUser(userId);
  const version = Date.now().toString();

  await Promise.all([
    redisClient.set(versionKey, version),
    redisClient.set(
      key,
      JSON.stringify({ _version: version, data: dbChats }),
      "EX",
      generateExpiration()
    ),
  ]);

  return dbChats;
}

export async function findChatNamesByService(userId: string) {
  const key = `${USER_CHATS_PREFIX}${userId}:chat-names`;
  const versionKey = `${USER_VERSION_PREFIX}${userId}`;

  const [cached, currentVersion] = await Promise.all([
    redisClient.get(key),
    redisClient.get(versionKey),
  ]);

  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    if (cachedData._version === currentVersion) {
      return cachedData.data;
    }
  }

  const dbChatNames = await chatRepo.getChatNamesByUser(userId);

  const version = Date.now().toString();

  await Promise.all([
    redisClient.set(versionKey, version),
    redisClient.set(
      key,
      JSON.stringify({ _version: version, data: dbChatNames }),
      "EX",
      generateExpiration()
    ),
  ]);

  return dbChatNames;
}

export const addOrRemoveFavoriteService = async (chatId: string) => {
  const chat = await chatRepo.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const updated = await chatRepo.toggleFavoriteStatus(chatId, chat.isFavorite);
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chat-names`),
    updateUserVersion(chat.userId),
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
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chat-names`),
    updateUserVersion(chat.userId),
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
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chat-names`),
    updateUserVersion(userId),
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
    updateUserVersion(chat.userId),
  ]);
  return updated;
};
