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

export async function listChats(userId: string) {
  return chatRepo.getChatsByUser(userId);
}

export async function findChatById(chatId: string) {
  return chatRepo.findById(chatId);
}

export async function findChatsByService(userId: string) {
  return chatRepo.getChatsByUser(userId);
}
