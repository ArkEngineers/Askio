import mongoose, { mongo } from "mongoose";

const userShema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  groupAdded:[{
    type:String
  }],
  chatId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chat"
  }
});

export default new mongoose.model("User", userShema);
