import { prisma } from "../config/db";

export async function createChatWithMessagesOrApendMesages(
  userId: string,
  messages: { role: string; content: string }[],
  chatId: string
) {
  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (existingChat) {
    await prisma.message.createMany({
      data: messages.map((m) => ({
        role: m.role,
        content: m.content,
        chatId: chatId,
      })),
      skipDuplicates: true,
    });

    return prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });
  } else {
    const userMessage = messages.find((m) => m.role === "user");
    const trimmedName = userMessage?.content.trim().slice(0, 50) || "New Chat";

    return prisma.chat.create({
      data: {
        id: chatId,
        userId,
        name: trimmedName,
        messages: {
          create: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      },
      include: { messages: true },
    });
  }
}

export function getChatsByUser(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    include: { messages: false },
    orderBy: { createdAt: "desc" },
  });
}

export function getChatNamesByUser(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    select: {
      id: true,
      name: true
    },
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

export const toggleFavoriteStatus = async (
  chatId: string,
  currentStatus: boolean
) => {
  return prisma.chat.update({
    where: { id: chatId },
    data: { isFavorite: !currentStatus },
  });
};

export const toggleArchiveStatus = async (
  chatId: string,
  currentStatus: boolean
) => {
  return prisma.chat.update({
    where: { id: chatId },
    data: { isArchived: !currentStatus },
  });
};

export const deleteChatById = async (chatId: string) => {
  return prisma.chat.delete({
    where: { id: chatId },
  });
};
