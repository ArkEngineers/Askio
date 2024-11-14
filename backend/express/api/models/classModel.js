import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userAdded: [
    {
        title:{type:String},
        url:{type:String},
        tag:{type:String},
    }
  ],
  notes: [
    {
      title: { type: String },
      url: { type: String },
      tag: { type: String },
    },
  ],
  leaderboard: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
      }
    }
  ]

},{timestamps:true});

export default new mongoose.model("Group", groupSchema);
