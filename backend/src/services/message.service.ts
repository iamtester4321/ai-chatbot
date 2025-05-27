import { generateExpiration, updateChatVersion } from "../utils/cache.utils";
import { CHAT_CACHE_PREFIX, CHAT_VERSION_PREFIX } from "../constants/redisKeys";
import {
  updateMessageReactionDislikeRepository,
  updateMessageReactionLikeRepository,
} from "../repositories/message.repository";
import * as chatRepo from "../repositories/chat.repository";
import { redisClient } from "../config/redis";

export const updateMessageReactionLikeService = async (messageId: string) => {
  const updatedMessage = await updateMessageReactionLikeRepository(messageId);

  if (updatedMessage?.chatId) {
    const cacheKey = `${CHAT_CACHE_PREFIX}${updatedMessage.chatId}`;
    const versionKey = `${CHAT_VERSION_PREFIX}${updatedMessage.chatId}`;
    const version = Date.now().toString();

    const dbChat = await chatRepo.findById(updatedMessage.chatId);

    await Promise.all([
      updateChatVersion(updatedMessage.chatId),
      redisClient.del(cacheKey),
      redisClient.set(versionKey, version),
      dbChat
        ? redisClient.set(
            cacheKey,
            JSON.stringify({ _version: version, data: dbChat }),
            "EX",
            generateExpiration()
          )
        : Promise.resolve(),
    ]);
  }

  return updatedMessage;
};

export const updateMessageReactionDislikeService = async (messageId: string) => {
  const updatedMessage = await updateMessageReactionDislikeRepository(messageId);

  if (updatedMessage?.chatId) {
    const cacheKey = `${CHAT_CACHE_PREFIX}${updatedMessage.chatId}`;
    const versionKey = `${CHAT_VERSION_PREFIX}${updatedMessage.chatId}`;
    const version = Date.now().toString();

    const dbChat = await chatRepo.findById(updatedMessage.chatId);

    await Promise.all([
      updateChatVersion(updatedMessage.chatId),
      redisClient.del(cacheKey),
      redisClient.set(versionKey, version),
      dbChat
        ? redisClient.set(
            cacheKey,
            JSON.stringify({ _version: version, data: dbChat }),
            "EX",
            generateExpiration()
          )
        : Promise.resolve(),
    ]);
  }

  return updatedMessage;
};
