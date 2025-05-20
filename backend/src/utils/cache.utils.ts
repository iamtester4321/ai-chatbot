import { redisClient } from "../config/redis";
import {
  CHAT_VERSION_PREFIX,
  SHARE_VERSION_PREFIX,
  USER_VERSION_PREFIX,
} from "../constants/redisKeys";

export function generateExpiration(): number {
  return 172800; // 48 hours in seconds
}

// Generate version using timestamp
function generateVersion(): string {
  return Date.now().toString();
}

export async function updateVersion(
  keyPrefix: string,
  id: string
): Promise<string> {
  const version = generateVersion();
  await redisClient.set(`${keyPrefix}${id}`, version);
  return version;
}

export async function getVersion(
  keyPrefix: string,
  id: string
): Promise<string | null> {
  return redisClient.get(`${keyPrefix}${id}`);
}

// Specific helpers
export const updateChatVersion = (chatId: string) =>
  updateVersion(CHAT_VERSION_PREFIX, chatId);
export const getChatVersion = (chatId: string) =>
  getVersion(CHAT_VERSION_PREFIX, chatId);

export const updateUserVersion = (userId: string) =>
  updateVersion(USER_VERSION_PREFIX, userId);
export const getUserVersion = (userId: string) =>
  getVersion(USER_VERSION_PREFIX, userId);

export const updateShareVersion = (shareId: string) =>
  updateVersion(SHARE_VERSION_PREFIX, shareId);
export const getShareVersion = (shareId: string) =>
  getVersion(SHARE_VERSION_PREFIX, shareId);
