import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createChatWithMessages(
  userId: string,
  messages: { role: string; content: string }[],
  chatId: string
) {
  return prisma.chat.create({
    data: {
      id: chatId,
      userId,
      name: "Default Chat Name",
      messages: {
        create: messages.map((m) => ({ role: m.role, content: m.content })),
      },
    },
    include: { messages: true },
  });
}

export function getChatsByUser(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    include: { messages: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(chatId: string) {
  return await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: true,
    },
  });
}
