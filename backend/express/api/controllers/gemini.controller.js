import ApiError from "../utils/ApiError.js";
import fs from "fs"
import path from "path";
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


export const PdfUrlUpload = asyncHandler(async (req, res) => {
  try {
    // Define a proper absolute path for saving the file
    const { Input_Msg,url } = req.body;
    const pdfLocalPath = path.join("public", "temp", "file.pdf");

    // Fetch the PDF file as a buffer
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    // Write the file locally
    fs.writeFileSync(pdfLocalPath, Buffer.from(pdfBuffer), "binary");

    // Extract input message from request body
    if (!Input_Msg) {
      return res.status(400).json(new ApiResponse(400, null, "Input_Msg is required"));
    }

    // Upload the PDF to Gemini
    const uploadResult = await uploadToGemini(
      pdfLocalPath,
      req.file?.mimetype || "application/pdf", // Default to PDF if undefined
      req.file?.originalname || "file.pdf"
    );

    // Send the uploaded PDF to the Gemini model
    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.uri,
          mimeType: uploadResult.mimeType,
        },
      },
      Input_Msg,
    ]);

    // Return the chatbot's response
    return res.status(200).json(new ApiResponse(200, await result.response.text(), "Response from the chatbot"));
  } catch (error) {
    console.error("Error in PdfUrlUpload:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});
