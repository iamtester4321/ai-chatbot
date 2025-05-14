import { generateShareIdService } from "../services/share.service";

export const generateShareId = async (req: any, res: any) => {
  const { id, chatId } = req.body;
  const userId = (req.user as { id: string }).id;
  try {
    const shareId = await generateShareIdService(id, chatId, userId);

    console.log("Generated share ID:", shareId);

    return res.status(200).json({ shareId });
  } catch (err) {
    console.error("Error generating share ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
