import { prisma } from "../config/db";

export const updateMessageReactionRepository = async (
  messageId: string,
  liked: boolean
) => {
  const dataToUpdate = liked
    ? { isLiked: true, isDisliked: false }
    : { isLiked: false, isDisliked: true };

  return prisma.message.update({
    where: { id: messageId },
    data: dataToUpdate,
  });
};
