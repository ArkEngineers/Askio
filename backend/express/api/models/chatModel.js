import mongoose from "mongoose";

// models/chatModel.js
const chatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  context: {
    type:[
      {
        name: String,
        model: String,
        usageMetadata: Object,
      },
    ],
    default: [],
  },
  fileIds:{
    type:[],
    default:[]
  },
  messages: {
    type:[
      {
        role: String, // "user" or "model"
        content: String, // user input or model response
      },
    ],
    default: [],
  },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;