import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: {
    type:String,
    required:true
  },
  faculty:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  userAdded:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  notes:[
    {
        url:{type:String},
        tag:{type:String},
    }
  ],
  leaderboard:[
    {
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       },
       score:{
        type:Number,
        default:0
       }
    }
  ],
  quiz:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  ]

});

export default new mongoose.model("Group", groupSchema);
