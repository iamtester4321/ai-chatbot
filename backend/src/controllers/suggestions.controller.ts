import asyncHandler from "express-async-handler";
import { getSuggestionsService } from "../services/suggestions.service";
import { RequestHandler } from "express";

export const getSuggestions: RequestHandler = asyncHandler(async (req, res) => {
  const searchText = req.query.text as string;

  if (!searchText?.trim()) {
    res.status(400).json({
      success: false,
      message: "Search text is required",
    });
    return;
  }

  try {
    const suggestions = await getSuggestionsService(searchText);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate suggestions",
    });
  }
});
