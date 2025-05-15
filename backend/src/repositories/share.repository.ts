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

export const findById = async (shareId: string) => {
  const share = await prisma.share.findUnique({
    where: { id: shareId },
    select: { chatId: true },
  });

  if (!share) {
    throw new Error(`Share with ID ${shareId} not found`);
  }
  return await prisma.chat.findUnique({
    where: { id: share.chatId },
    include: {
      messages: true,
    },
  });
};
