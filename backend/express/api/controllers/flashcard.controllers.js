import { Flashcard } from "../models/Flashcard.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"

export const FetchFlashCardfromDb = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  try {
    const flashcards = await Flashcard.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(user_id) } },
      {
        $project: {
          PDF_Title: { $arrayElemAt: ["$FlashData.PDF_Title", 0] },
          QA: { $arrayElemAt: ["$FlashData.QA",0]},
          userId: 1,
          
        },
      },
    ]);

    if (!flashcards || flashcards.length === 0) {
      return res.status(404).json(new ApiError(404, "Flashcards not found"));
    }

    return res.status(200).json(flashcards);
  } catch (error) {
    console.error("Error in Fetching Flashcards from DB:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});