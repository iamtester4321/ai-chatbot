import { redisClient } from "../config/redis";
import {
  CHAT_CACHE_PREFIX,
  CHAT_VERSION_PREFIX,
  SHARE_CACHE_PREFIX,
  USER_CHATS_PREFIX,
  USER_VERSION_PREFIX,
} from "../constants/redisKeys";
import * as chatRepo from "../repositories/chat.repository";
import * as shareRepo from "../repositories/share.repository";
import {
  generateExpiration,
  getShareVersion,
  updateChatVersion,
  updateShareVersion,
  updateUserVersion,
} from "../utils/cache.utils";
import { decryptMessage, encryptMessage } from "../utils/encryption.utils";

export async function saveChat(
  userId: string,
  messages: { id: string; role: string; content: string; for: string }[],
  chatId: string,
  sourceId?: string
) {
  const result = await chatRepo.createChatWithMessagesOrApendMesages(
    userId,
    messages,
    chatId,
    sourceId
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
    // Decrypt the chat name before caching/returning
    if (dbChat.name) {
      dbChat.name = await decryptMessage(dbChat.name);
    }
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
  let dbChats = await chatRepo.getChatsByUser(userId);
  dbChats = await Promise.all(
    dbChats.map(async (chat) => ({
      ...chat,
      name: chat.name ? await decryptMessage(chat.name) : chat.name,
    }))
  );
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
export async function findShareById(shareId: string) {
  const key = `${SHARE_CACHE_PREFIX}${shareId}`;
  const cached = await redisClient.get(key);
  const currentVersion = await getShareVersion(shareId);

  // Always fetch fresh data from DB
  const dbShare = await shareRepo.findById(shareId);

  if (cached && currentVersion) {
    const cachedData = JSON.parse(cached);
    // Compare cached data with DB data
    if (
      cachedData._version === currentVersion &&
      JSON.stringify(cachedData.data) === JSON.stringify(dbShare)
    ) {
      return cachedData.data;
    }
  }

  if (dbShare) {
    const version = await updateShareVersion(shareId);
    await redisClient.set(
      key,
      JSON.stringify({
        _version: version,
        data: dbShare,
      })
    );
  }
  return dbShare;
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
  let dbChatNames = await chatRepo.getChatNamesByUser(userId);

  dbChatNames = await Promise.all(
    dbChatNames.map(async (chat) => ({
      ...chat,
      name: chat.name ? await decryptMessage(chat.name) : chat.name,
    }))
  );
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

  // Encrypt the new name before saving
  const encryptedName = await encryptMessage(newName);

  const updated = await chatRepo.renameChat(chatId, encryptedName);
  await Promise.all([
    redisClient.del(`${CHAT_CACHE_PREFIX}${chatId}`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chats`),
    redisClient.del(`${USER_CHATS_PREFIX}${chat.userId}:chat-names`),
    updateUserVersion(chat.userId),
  ]);
  return updated;
};
