import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  quizData: {
    type: Array,
    required: true,
  },
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", quizSchema);
