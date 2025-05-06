import { prisma } from "../config/db";

interface SaveChatParams {
  userId: string;
  name: string;
  type: string;
}

interface UpdateChatParams {
  userId: string;
  chatId: string;
  name: string;
}

interface DeleteChatParams {
  userId: string;
  chatId: string;
}

export async function findChatsByUserId(userId: string) {
  return prisma.chat.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveChat({ userId, name, type }: SaveChatParams) {
  return prisma.chat.create({
    data: { userId: userId, name, type: "text", messages: { create: [] } },
  });
}

export async function updateChatName({
  chatId,
  name,
  userId,
}: UpdateChatParams) {
  return prisma.chat.update({
    where: { id: chatId, userId },
    data: { name },
  });
}

export async function deleteChatById({ userId, chatId }: DeleteChatParams) {
  return prisma.chat.delete({
    where: { id: chatId, userId },
  });
}
