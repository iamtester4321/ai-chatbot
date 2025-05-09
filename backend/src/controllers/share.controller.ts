import { generateShareIdService } from "../services/share.service";

export const generateShareId = async (req: any, res: any) => {
  const { id, chatId, userId } = req.body;

  try {
    const shareId = await generateShareIdService(id, chatId, userId);
    return res.status(200).json({ shareId });
  } catch (err) {
    console.error("Error generating share ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
