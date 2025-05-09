import * as chatRepo from "../repositories/chat.repository";

export async function saveChat(
  userId: string,
  messages: { role: string; content: string }[],
  chatId: string
) {
  return chatRepo.createChatWithMessagesOrApendMesages(
    userId,
    messages,
    chatId
  );
}

export async function findChatById(chatId: string) {
  return chatRepo.findById(chatId);
}

export async function findChatsByService(userId: string) {
  return chatRepo.getChatsByUser(userId);
}

export const addOrRemoveFavoriteService = async (chatId: string) => {
  const chat = await chatRepo.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const updatedChat = await chatRepo.toggleFavoriteStatus(
    chatId,
    chat.isFavorite
  );
  return updatedChat;
};

export const addOrRemoveArchiveService = async (chatId: string) => {
  const chat = await chatRepo.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const updatedChat = await chatRepo.toggleArchiveStatus(
    chatId,
    chat.isArchived
  );
  return updatedChat;
};
