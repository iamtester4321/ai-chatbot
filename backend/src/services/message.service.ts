import { updateMessageReactionRepository } from "../repositories/message.repository";

export const updateMessageReactionService = async (
  messageId: string,
  liked: boolean
) => {
  return updateMessageReactionRepository(messageId, liked);
};
