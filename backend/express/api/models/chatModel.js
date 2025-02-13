import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  context:[{
    name:String,
    model:String,
    usageMetadata:{
        totalTokenCount:String
    }
  }]
});

export default new mongoose.model("Chat", chatSchema);
