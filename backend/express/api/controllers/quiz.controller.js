import { Quiz } from "../models/quizModel.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const FetchQuizfromDb=asyncHandler(async(req,res)=>{
    const {user_id}=req.body;
    try {
        const quiz=await Quiz.findOne({userId:user_id});
        if (!quiz) {
            return res
                .status(404)
                .json(new ApiError(404,"Quiz not found"));
        }
        return res.status(200).json(quiz.quizData)
    } catch (error) {
        console.error("Error in Fetching Quiz from DB:", error);
        return res
            .status(500)
            .json(new ApiError(500,"Internal Server Error"));
    }
})