import { updateMessageReactionLikeRepository, updateMessageReactionDislikeRepository } from "../repositories/message.repository";

export const updateMessageReactionLikeService = async (
  messageId: string,
  liked: boolean
) => {
  return updateMessageReactionLikeRepository(messageId, liked);
};

export const updateMessageReactionDislikeService = async (
  messageId: string,
  disliked: boolean
) => {
  return updateMessageReactionDislikeRepository(messageId, disliked);
};