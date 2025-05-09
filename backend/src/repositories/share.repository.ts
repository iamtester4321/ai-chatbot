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
  return prisma.share.create({
    data: {
      id,
      chatId,
      userId,
    },
  });
};
