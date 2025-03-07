import mongoose from "mongoose";

const flashSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  FlashData: {
    type: Array,
    required: true,
  },
}, { timestamps: true });

export const Flashcard = mongoose.model("Flashcard", flashSchema);
