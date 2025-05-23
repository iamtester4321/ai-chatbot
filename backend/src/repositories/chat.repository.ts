import { prisma } from "../config/db";
import { encryptMessage, decryptMessage } from "../utils/encryption.utils";
import { v4 as uuidv } from "uuid";

export async function createChatWithMessagesOrApendMesages(
  userId: string,
  messages: { id: string; role: string; content: string }[],
  chatId: string
) {
  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (existingChat) {
    await prisma.message.createMany({
      data: messages.map((m) => ({
        id: uuidv(),
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
    let trimmedName = "New Chat";

    if (userMessage) {
      const decrypted = await decryptMessage(userMessage.content);
      trimmedName = decrypted.trim().slice(0, 50);
    }

    const encryptedName = await encryptMessage(trimmedName);

    return prisma.chat.create({
      data: {
        id: chatId,
        userId,
        name: encryptedName,
        messages: {
          create: messages.map((m) => ({
            id: uuidv(),
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

export async function getChatNamesByUser(userId: string) {
  const chats = await prisma.chat.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      isFavorite: true,
      isArchived: true,
      isShare: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return Promise.all(
    chats.map(async (chat) => ({
      ...chat,
      name: chat.name,
    }))
  );
}

export async function findById(chatId: string) {
  return await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
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

export const renameChat = async (chatId: string, newName: string) => {
  const encryptedName = await encryptMessage(newName);
  return prisma.chat.update({
    where: { id: chatId },
    data: { name: encryptedName },
  });
};

export const deleteChatById = async (chatId: string) => {
  return prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
};

export async function createChatFromSourceChat(
  userId: string,
  newChatId: string,
  sourceChatId: string
): Promise<{
  success: boolean;
  error?: string;
  data?: { id: string; role: string; content: string }[];
}> {
  try {
    const sourceChat = await prisma.chat.findUnique({
      where: { id: sourceChatId },
      include: { messages: true },
    });

    if (!sourceChat) {
      return { success: false, error: "Source chat not found." };
    }

    const messages = sourceChat.messages.map((m) => {
      return { ...m, id: uuidv() };
    });

    console.log("source chat messages::", messages);

    let chatName = "New Chat";
    const firstUserMessage = sourceChat.messages.find((m) => m.role === "user");

    if (firstUserMessage) {
      const decrypted = await decryptMessage(firstUserMessage.content);
      chatName = decrypted.trim().slice(0, 50);
    }

    const encryptedName = await encryptMessage(chatName);

    const data = await prisma.chat.create({
      data: {
        id: newChatId,
        userId,
        name: encryptedName,
        messages: {
          create: messages,
        },
      },
    });

    console.log("data::", data);

    return { success: true, data: [] };
  } catch (error) {
    console.error("Failed to create chat:", error);
    return {
      success: false,
      error: "An error occurred while creating the chat.",
    };
  }
}
