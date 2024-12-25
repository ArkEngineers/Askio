import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  groupAdded:[{
    type:String
  }]
});

export default new mongoose.model("User", userShema);
