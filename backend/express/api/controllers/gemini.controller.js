import ApiError from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  model,
  generationConfig,
  cacheCreation,
  uploadToGemini,
  cacheFetch,
  waitForFilesActive,
} from "../utils/gemini_utils.js";
import Chat from "../models/chatModel.js";
import userModel from "../models/userModel.js";
import { google } from "googleapis";
import oauth2client from "../utils/oauth2client.js";
import { Quiz } from "../models/quizModel.js";
import { Flashcard } from "../models/Flashcard.js";

const MAX_TOKENS = 4096; // Example token limit
const TRUNCATE_THRESHOLD = 100; // Number of messages before truncation
const SUMMARY_PROMPT = "Summarize the following conversation:";

function truncateContext(context, maxTokens) {
  const tokens = context.split(" ");
  if (tokens.length > maxTokens) {
    return tokens.slice(-maxTokens).join(" ");
  }
  return context;
}

async function summarizeContext(messages) {
  const context = messages.map((message) => `${message.role}: ${message.content}`).join("\n");
  const prompt = `${SUMMARY_PROMPT}\n${context}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export const RunChat = asyncHandler(async (req, res) => {
  const pdfLocalPath = req.file?.path; //path in local server not on cloudinary
  if (!pdfLocalPath) throw new ApiError(400, "PDF file is required");

  const { Input_Msg } = req.body;

  const uploadResult = await uploadToGemini(
    pdfLocalPath,
    `${req.file?.mimetype}`,
    `${req.file?.originalname}`
  );
  const result = await model.generateContent([
    {
      fileData: {
        fileUri: uploadResult.uri,
        mimeType: uploadResult.mimeType,
      },
    },
    `${Input_Msg}`,
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, result.response.text(), "Response from the chatbot")
    );
});

export const textGeneration = asyncHandler(async (req, res) => {
  const { Input_Msg } = req.body;

  const result = await model.generateContent(`${Input_Msg}`);
  return res.status(200).json(new ApiResponse(200, result.response.text(), "Response from the chatbot"));
});

// export const talkToCacheFile = asyncHandler(async (req, res) => {
//   const { file } = req.body
//   const genModel = await cacheCreation(file)
//   const result = await genModel.generateContent({
//     contents: [
//       {
//         role: 'user',
//         parts: [
//           {
//             text:
//               'What are pillars of CC , Explain in detail?',
//           },
//         ],
//       },
//     ],
//   });

//   console.log(result.response.usageMetadata);
//   return res.status(200).json(new ApiResponse(200, result.response.text(), "Response from the chatbot"));

// })

export const FetchQuiz = asyncHandler(async (req, res) => {
  try {
    const {
      fileId,
      userId,
      filename,
      Token,
      chatId,
    } = req.body;
    console.log("FileId: ", fileId);
    const Input_Msg = "Create 5 questions and their answers in a quiz format with the correct answer. Reply in JSON format such that: quiz (array of object) → <PDF_Title>, QA(array of questions) , make it easier to parse,make sure the PDF_Title ="+filename+" exactly";
    oauth2client.setCredentials(Token);
    const auth = oauth2client;
    let pdfBuffer = null;

    if (fileId) {
      const drive = google.drive({ version: "v3", auth });
      const response = await drive.files.get(
        {
          fileId,
          alt: "media",
        },
        { responseType: "arraybuffer" }
      );
      pdfBuffer = response.data;
    }

    if (!pdfBuffer) {
      throw new ApiError(400, "Failed to fetch PDF data");
    }

    const pdfLocalPath = path.join("public", "temp", "file.pdf");
    fs.writeFileSync(pdfLocalPath, Buffer.from(pdfBuffer), "binary");

    const uploadResult = await uploadToGemini(
      pdfLocalPath,
      req.file?.mimetype || "application/pdf",
      req.file?.originalname || "file.pdf"
    );

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.uri,
          mimeType: uploadResult.mimeType,
        },
      },
      Input_Msg,
    ]);

    // Extract response text
    let responseText = result.response.text();

    // Remove Markdown JSON formatting if it exists
    let cleanedResponseText = responseText.replace(/```json\n?|\n?```/g, "");

    // Try to parse the JSON data, attempt to fix if fails
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedResponseText);
    } catch (err) {
      // Attempt to fix common JSON issues
      try {
        // Replace single quotes with double quotes
        let fixed = cleanedResponseText.replace(/'/g, '"');
        // Remove trailing commas
        fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        // Add missing brackets if possible
        if (!fixed.trim().startsWith("{") && !fixed.trim().startsWith("[")) {
          fixed = "{" + fixed + "}";
        }
        parsedData = JSON.parse(fixed);
      } catch (fixErr) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid JSON response from chatbot"));
      }
    }

    // Ensure it has the required quiz structure
    if (!parsedData.quiz || !Array.isArray(parsedData.quiz)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid quiz format"));
    }

    // Check if a quiz already exists for the current user
    let existingQuiz = await Quiz.findOne({ userId });

    if (existingQuiz) {
      // Add the new quiz data to the existing quizData array
      existingQuiz.quizData.push(...parsedData.quiz);
      await existingQuiz.save();
    } else {
      // Create a new quiz document
      const newQuiz = new Quiz({
        userId,
        quizData: parsedData.quiz,
      });
      await newQuiz.save();
      existingQuiz = newQuiz;
    }

    return res.status(200).json(
      new ApiResponse(200, { quiz: existingQuiz.quizData, userId: userId }, "Quiz saved successfully")
    );
  } catch (error) {
    console.error("Error in Fetching Quiz:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const FetchFlashQuestion = asyncHandler(async (req, res) => {
  try {
    const {
      fileId,
      filename,
      userId,
      Token,
    } = req.body;
    console.log("FileName: ", filename);
    const Input_Msg = `Create Flashcard question and answer type list with answers in one word or sentence in pure json format to learn the content of pdf easily like deck(array of object) → <PDF_Title>, QA(array of questions) , make it easier to parse, make sure the PDF_Title =${filename} exactly`;
    oauth2client.setCredentials(Token);
    const auth = oauth2client;
    let pdfBuffer = null;

    if (fileId) {
      console.log("FileId: ", fileId);
      const drive = google.drive({ version: "v3", auth });
      const response = await drive.files.get(
        {
          fileId,
          alt: "media",
        },
        { responseType: "arraybuffer" }
      );
      console.log("PDF DATA: ", response.data);
      pdfBuffer = response.data;
    }
    const pdfLocalPath = path.join("public", "temp", "file.pdf");
    fs.writeFileSync(pdfLocalPath, Buffer.from(pdfBuffer), "binary");

    const uploadResult = await uploadToGemini(
      pdfLocalPath,
      req.file?.mimetype || "application/pdf",
      req.file?.originalname || "file.pdf"
    );

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.uri,
          mimeType: uploadResult.mimeType,
        },
      },
      Input_Msg,
    ]);
      // Extract response text
      const responseText = result.response.text();
    
      // Remove Markdown JSON formatting if it exists
      const cleanedResponseText = responseText.replace(/```json\n?|\n?```/g, "");
    
      // Parse the JSON data
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedResponseText);
      } catch (err) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid JSON response from chatbot"));
      }

    const newQuiz = new Flashcard({
      userId,
      FlashData: parsedData.deck,
    });

    await newQuiz.save();

    return res.status(200).json(
      new ApiResponse(200, { deck: parsedData.deck}, "Flashcard saved successfully")
    );
  } catch (error) {
    console.error("Error in Fetching Quiz:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const PdfUrlUpload = asyncHandler(async (req, res) => {
  try {
    let { Input_Msg } = req.body;
    let {
      fileIds, // Change to array of fileIds
      url,
      userId,
      Token,
      chatId,
    } = req.body;

    if (!Input_Msg) {
      Input_Msg = "Write a generic one line summary for the given PDF , reply with whether the file is uploaded successfully or not";
    }
    Input_Msg = Input_Msg+"make sure to return in markdown format with ```json\n and \n``` at the end";
    oauth2client.setCredentials(Token);
    const auth = oauth2client;
    let pdfBuffers = [];

    if (fileIds && fileIds.length > 0) {
      const drive = google.drive({ version: "v3", auth });
      for (const fileId of fileIds) {
        console.log("FileId: ", fileId);
        const response = await drive.files.get(
          {
            fileId,
            alt: "media",
          },
          { responseType: "arraybuffer" }
        );
        console.log("PDF DATA: ", response.data,"FILEID: ",fileId);
        pdfBuffers.push({ buffer: response.data, id: fileId });
      }
    } else if (url) {
      const response = await axios(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      pdfBuffers.push({ buffer: await response.arrayBuffer(), id: null });
    } else {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Either fileIds or url is required"
          )
        );
    }

    let chat = null;
    if (chatId) {
      chat = await Chat.findById(chatId);
    }
    const currentUser = await userModel.findById(userId);
    const defaultChat = await Chat.findById(currentUser.chatId);
    if (!chat) {
      chat = await Chat.create({
        user_id: userId,
        context: [],
        messages: [{ role: "user", content: Input_Msg }],
        fileIds: [],
      });
    } else {
      chat.messages.push({ role: "user", content: Input_Msg });
      await chat.save();
    }
    defaultChat.messages.push({ role: "user", content: Input_Msg });
    await defaultChat.save();
    if (!defaultChat) throw new ApiError(400, "Chat cannot be uploaded");

    if (!chat) throw new ApiError(400, "Chat cannot be uploaded");

    let combinedResponseText = "";

    for (const pdfBufferObj of pdfBuffers) {
      const tempDir = path.join("public", "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const pdfLocalPath = path.join(tempDir, "file.pdf");
      fs.writeFileSync(pdfLocalPath, Buffer.from(pdfBufferObj.buffer), "binary");

      const uploadResult = await uploadToGemini(
        pdfLocalPath,
        req.file?.mimetype || "application/pdf",
        req.file?.originalname || "file.pdf"
      );

      const result = await model.generateContent([
        {
          fileData: {
            fileUri: uploadResult.uri,
            mimeType: uploadResult.mimeType,
          },
        },
        Input_Msg,
      ]);

      const responseText = result.response.text();
      combinedResponseText += responseText + "\n";

      // Save the model's response to the chat history
      chat.messages.push({ role: "model", content: responseText });
      chat.fileIds.push(pdfBufferObj.id || uploadResult.uri); // Add fileId or uploadResult.uri to chat's fileIds array
      await chat.save();

      defaultChat.messages.push({ role: "model", content: responseText });
      await defaultChat.save();
    }

    // Periodically truncate and summarize the context
    if (chat.messages.length > TRUNCATE_THRESHOLD) {
      const summary = await summarizeContext(chat.messages);
      chat.messages = [{ role: "system", content: summary }];
      await chat.save();
    }
    if (defaultChat.messages.length > TRUNCATE_THRESHOLD) {
      const summary = await summarizeContext(defaultChat.messages);
      defaultChat.messages = [{ role: "system", content: summary }];
      await defaultChat.save();
    }

    return res.status(200).json(new ApiResponse(200, { "response_text": combinedResponseText.trim(), "chatId": chat._id, "fileIds": chat.fileIds }, "Response from the chatbot"));
  } catch (error) {
    console.error("Error in PdfUrlUpload:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});


export const TalkFromContext = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId, Input_Msg } = req.body;

    if (!Input_Msg) {
      throw new ApiError(400, "chatId and Input_Msg are required");
    }

    let chat = null
    if (!chatId) {
      currentUser = await userModel.findById(userId);
      chat = await Chat.findById(currentUser.chatId);
    } else {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    // Rebuild context from chat history
    const context = chat.messages
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    // Append the new user input to the context
    const truncatedContext = truncateContext(context, MAX_TOKENS);
    const fullPrompt = `${truncatedContext}\nUser: ${Input_Msg}`;

    // Send the full prompt to Gemini's API
    const result = await model.generateContent(fullPrompt);

    // Save the new interaction to the chat history
    chat.messages.push({ role: "user", content: Input_Msg });
    chat.messages.push({ role: "model", content: result.response.text() });
    await chat.save();

    // Periodically truncate and summarize the context
    if (chat.messages.length > TRUNCATE_THRESHOLD) {
      const summary = await summarizeContext(chat.messages);
      chat.messages = [{ role: "system", content: summary }];
      await chat.save();
    }

    return res.status(200).json(new ApiResponse(200, { "response_text": result.response.text() }, "Response from the chatbot"));
  } catch (error) {
    console.error("Error in TalkFromContext:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
});

// Helper function to check if a response is invalid
const isInvalidResponse = (responseText) => {
  const invalidPhrases = [
    "not in pdf",
    "not available",
    "no information",
    "cannot answer",
  ];
  return invalidPhrases.some((phrase) =>
    responseText.toLowerCase().includes(phrase)
  );
};

async function getAttachmentFromClassroom(
  auth,
  courseId,
  courseworkId,
  attachmentId
) {
  console.log(auth);
  const classroom = google.classroom({ version: "v1", auth });
  console.log(classroom);
  // console.log(classroom)

  try {
    const courseworkResponse = await classroom.courses.courseWorkMaterials.get({
      courseId: courseId,
      id: courseworkId,
    });

    const coursework = courseworkResponse.data;

    if (!coursework.materials || coursework.materials.length === 0) {
      throw new Error("No materials found in this coursework.");
    }

    let driveFileId = null;
    for (const material of coursework.materials) {
      if (
        material.driveFile &&
        material.driveFile.driveFile &&
        material.driveFile.driveFile.id === attachmentId
      ) {
        driveFileId = material.driveFile.driveFile.id;
        break;
      }
    }

    if (!driveFileId) {
      throw new Error("Attachment not found in coursework.");
    }

    // Now download the file from Drive using the driveFileId (assuming you have Drive API enabled as well)
    const drive = google.drive({ version: "v3", auth });
    const response = await drive.files.get(
      {
        fileId: driveFileId,
        alt: "media",
      },
      { responseType: "arraybuffer" }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Error getting attachment from Classroom:", error);
    throw new Error(
      `Failed to get attachment from Classroom: ${error.message}`
    );
  }
}


export const fetchChatId = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const chatIds = await Chat.find({ user_id: userId }).select('_id');
  if (!chatIds || chatIds.length === 0) throw new ApiError(404, "Chat not found");

  return res.status(200).json(new ApiResponse(200, chatIds, "Chat Ids fetched successfully"));
});

export const fetchChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) throw new ApiError(404, "Chat not found");
  return res.status(200).json(new ApiResponse(200, chat, "Chat fetched successfully"));
});