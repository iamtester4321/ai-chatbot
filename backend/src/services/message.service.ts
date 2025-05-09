import { updateMessageReactionRepository } from "../repositories/message.repository";
import { redisClient } from "../config/redis";

const CHAT_CACHE_PREFIX = "chat:";

export const updateMessageReactionService = async (
  messageId: string,
  liked: boolean
) => {
  const updated = await updateMessageReactionRepository(messageId, liked);
  // invalidate the chat detail cache
  await redisClient.del(`${CHAT_CACHE_PREFIX}${updated.chatId}`);
  return updated;
};
