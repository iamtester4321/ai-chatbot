import * as chatRepo from "../repositories/chat.repository";

export async function getChatsByUser(userId: string) {
  return chatRepo.findChatsByUserId(userId);
}

export async function createChat(userId: string, name: string, type: string) {
  return chatRepo.saveChat({ userId, name: name || "", type: type });
}

export async function renameChat(chatId: string, name: string, userId: string) {
  return chatRepo.updateChatName({ chatId, name, userId });
}

export async function deleteChat(userId: string, chatId: string) {
  return chatRepo.deleteChatById({ userId, chatId });
}
