import { Request, Response, NextFunction } from "express";
import * as chatService from "../services/chat.service";

export async function getAllChats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req.user as { id: string })?.id;
    const chats = await chatService.getChatsByUser(userId);
    res.json(chats);
  } catch (err) {
    next(err);
  }
}

export async function createChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req.user as { id: string })?.id;
    const { name, type } = req.body;
    const chat = await chatService.createChat(userId, name, type);
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
}

export async function renameChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req.user as { id: string })?.id;
    const { chatId } = req.params;
    const { name } = req.body;
    const updated = await chatService.renameChat(chatId, name, userId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req.user as { id: string })?.id;
    const { chatId } = req.params;
    await chatService.deleteChat(userId, chatId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
