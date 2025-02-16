import mongoose from "mongoose";

// models/chatModel.js
const chatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  context: [
    {
      name: String,
      model: String,
      usageMetadata: Object,
    },
  ],
  messages: [
    {
      role: String, // "user" or "model"
      content: String, // user input or model response
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;