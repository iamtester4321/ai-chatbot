import {
  updateMessageReactionDislikeRepository,
  updateMessageReactionLikeRepository,
} from "../repositories/message.repository";

export const updateMessageReactionLikeService = async (messageId: string) => {
  return updateMessageReactionLikeRepository(messageId);
};

export const updateMessageReactionDislikeService = async (
  messageId: string
) => {
  return updateMessageReactionDislikeRepository(messageId);
};
