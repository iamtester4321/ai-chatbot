import {
  getShareByChatId,
  createShare,
} from "../repositories/share.repository";

export const generateShareIdService = async (
  id: string,
  chatId: string,
  userId: string
) => {
  const existingShare = await getShareByChatId(chatId);

  if (existingShare) {
    return existingShare.id;
  }

  const newShare = await createShare(id, chatId, userId);
  return newShare.id;
};
