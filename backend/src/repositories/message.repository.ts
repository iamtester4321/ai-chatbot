import { prisma } from "../config/db";

export const updateMessageReactionLikeRepository = async (
  messageId: string
) => {
  const currentMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: { isLiked: true, chatId: true }
  });

  const dataToUpdate = currentMessage?.isLiked
    ? { isLiked: false }
    : { isLiked: true };

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
    select: {
      id: true,
      chatId: true,
      isLiked: true
    }
  });

  return updatedMessage;
};

export const updateMessageReactionDislikeRepository = async (
  messageId: string
) => {
  const currentMessage = await prisma.message.findUnique({
    where: { id: messageId },
    select: { isDisliked: true, chatId: true }
  });

  const dataToUpdate = currentMessage?.isDisliked
    ? { isDisliked: false }
    : { isDisliked: true };

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
    select: {
      id: true,
      chatId: true,
      isDisliked: true
    }
  });

  return updatedMessage;
};
