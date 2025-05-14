import { prisma } from "../config/db";

export const getShareByChatId = async (chatId: string) => {
  return prisma.share.findFirst({
    where: { chatId },
  });
};

export const createShare = async (
  id: string,
  chatId: string,
  userId: string
) => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { isShare: true },
  });

  return prisma.share.create({
    data: {
      id,
      chatId,
      userId,
    },
  });
};
