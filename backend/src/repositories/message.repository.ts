import { prisma } from "../config/db";

export const updateMessageReactionLikeRepository = async (
  messageId: string
) => {
  const currentMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: { isLiked: true, isDisliked: true },
  });

  const dataToUpdate = currentMessage?.isDisliked
    ? { isDisliked: false, isLiked: true }
    : currentMessage?.isLiked
    ? { isLiked: false }
    : { isLiked: true };

  return prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
  });
};

export const updateMessageReactionDislikeRepository = async (
  messageId: string
) => {
  const currentMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: { isLiked: true, isDisliked: true },
  });

  const dataToUpdate = currentMessage?.isLiked
    ? { isLiked: false, isDisliked: true }
    : currentMessage?.isDisliked
    ? { isDisliked: false }
    : { isDisliked: true };

  return prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
  });
};
