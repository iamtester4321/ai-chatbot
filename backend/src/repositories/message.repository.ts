import { prisma } from "../config/db";

export const updateMessageReactionLikeRepository = async (
  messageId: string,
  liked: boolean
) => {
  const dataToUpdate = liked
    ? { isLiked: true}
    : { isLiked: false};

  return prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
  });
};

export const updateMessageReactionDislikeRepository = async (
  messageId: string,
  disliked: boolean
) => {
  const dataToUpdate = disliked
    ? { isDisliked: true }
    : { isDisliked: false };

  return prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
  });
};