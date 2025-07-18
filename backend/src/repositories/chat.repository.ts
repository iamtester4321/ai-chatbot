import { prisma } from "../config/db";
import { encryptMessage, decryptMessage } from "../utils/encryption.utils";
import { v4 as uuidv4 } from "uuid";

export async function createChatWithMessagesOrAppendMessages(
  userId: string,
  messages: { id: string; role: string; content: string; for?: string }[],
  chatId: string,
  sourceChatId?: string
) {
  let allMessages = messages;

  if (sourceChatId) {
    const sourceChat = await prisma.chat.findUnique({
      where: { id: sourceChatId },
      include: { messages: true },
    });

    if (!sourceChat) {
      throw new Error("Source chat not found");
    }

    allMessages = sourceChat.messages.map((m) => ({
      id: uuidv4(),
      role: m.role,
      content: m.content,
      for: (m as any).for,
    }));
  }

  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (existingChat) {
    await prisma.message.createMany({
      data: allMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        chatId: chatId,
        for: m.for,
      })),
      skipDuplicates: true,
    });

    return prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });
  } else {
    let trimmedName = "New Chat";

    const userMessage = allMessages.find((m) => m.role === "user");
    if (userMessage) {
      const decrypted = await decryptMessage(userMessage.content);
      trimmedName = decrypted.trim().slice(0, 50);
    }

    const encryptedName = await encryptMessage(trimmedName);

    const chat = await prisma.chat.create({
      data: {
        id: chatId,
        userId,
        name: encryptedName,
        messages: {
          create: allMessages.map((m) => ({
            id: m.id || uuidv4(),
            role: m.role,
            content: m.content,
            for: m.for,
          })),
        },
      },
      include: { messages: true },
    });

    return chat;
  }
}

export async function createChatFromSourceChat(
  userId: string,
  newChatId: string,
  sourceChatId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sourceChat = await prisma.chat.findUnique({
      where: { id: sourceChatId },
      include: { messages: true },
    });

    if (!sourceChat) {
      return { success: false, error: "Source chat not found." };
    }

    const messages = sourceChat.messages.map((m) => ({
      id: uuidv4(),
      role: m.role,
      content: m.content,
    }));

    let chatName = "New Chat";
    const firstUserMessage = sourceChat.messages.find((m) => m.role === "user");

    if (firstUserMessage) {
      const decrypted = await decryptMessage(firstUserMessage.content);
      chatName = decrypted.trim().slice(0, 50);
    }

    const encryptedName = await encryptMessage(chatName);

    await prisma.chat.create({
      data: {
        id: newChatId,
        userId,
        name: encryptedName,
        messages: {
          create: messages,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create chat:", error);
    return {
      success: false,
      error: "An error occurred while creating the chat.",
    };
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
