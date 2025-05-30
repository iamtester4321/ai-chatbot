import {
  createShare,
  getShareByChatId,
  findById as getShareById,
} from "../repositories/share.repository";

import { redisClient } from "../config/redis";
import { SHARE_CACHE_PREFIX, USER_CHATS_PREFIX } from "../constants/redisKeys";

import { updateShareVersion, updateUserVersion } from "../utils/cache.utils";

export const generateShareIdService = async (
  id: string,
  chatId: string,
  userId: string
) => {
  const existingShare = await getShareByChatId(chatId);
  if (existingShare) return existingShare.id;

  const newShare = await createShare(id, chatId, userId);

  await Promise.all([
    redisClient.del(`${SHARE_CACHE_PREFIX}${newShare.id}`),
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chats`),
    redisClient.del(`${USER_CHATS_PREFIX}${userId}:chat-names`),
    updateShareVersion(newShare.id),
    updateUserVersion(userId),
  ]);

  return newShare.id;
};

export const findShareById = async (shareId: string) => {
  const cacheKey = `${SHARE_CACHE_PREFIX}${shareId}`;

  const dbShare = await getShareById(shareId);

  if (dbShare) {
    const newVersion = await updateShareVersion(shareId);
    await redisClient.set(
      cacheKey,
      JSON.stringify({ _version: newVersion, data: dbShare })
    );
  }

  return dbShare;
};
