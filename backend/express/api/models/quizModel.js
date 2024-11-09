import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  question:[
    {
        body:{
            type:String,
        },
        options:[{
            type:String,
        }],
        answer:{
            type:Number
        }
    }
  ]

});

export default new mongoose.model("Quiz", quizSchema);
