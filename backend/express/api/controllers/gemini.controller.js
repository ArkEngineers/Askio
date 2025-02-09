import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { model,generationConfig,cacheCreation,uploadToGemini,waitForFilesActive } from "../utils/gemini_utils.js";

export const RunChat = asyncHandler(async (req, res) => {
    const pdfLocalPath = req.file?.path; //path in local server not on cloudinary
    if (!pdfLocalPath) throw new ApiError(400, "PDF file is required");

    const {Input_Msg}=req.body;

    const uploadResult=await uploadToGemini(
        pdfLocalPath,
        `${req.file?.mimetype}`,
        `${req.file?.originalname}`
    )
    const result = await model.generateContent([
        {
            fileData: {
                fileUri: uploadResult.uri,
                mimeType: uploadResult.mimeType,
            },
        },
        `${Input_Msg}`,
    ]);
    return res.status(200).json(new ApiResponse(200, result.response.text(), "Response from the chatbot"));
});

export const textGeneration = asyncHandler(async (req, res) => {
    const {Input_Msg}=req.body;

    const result=await model.generateContent(`${Input_Msg}`);
    return res.status(200).json(new ApiResponse(200, result.response.text(), "Response from the chatbot"));
});

export const talkToCacheFile=asyncHandler(async(req,res)=>{
    const {file}=req.body
    const genModel=await cacheCreation(file)
    const result = await genModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'What are pillars of CC , Explain in detail?',
              },
            ],
          },
        ],
      });
      
      console.log(result.response.usageMetadata);
      return res.status(200).json(new ApiResponse(200, result.response.text(), "Response from the chatbot"));

})