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
      Token,
      chatId,
    } = req.body;
    const Input_Msg = "Create 5 questions and their answers in a quiz format with the correct answer. Reply in JSON format such that: quiz (array of object) → <PDF_Title>, QA(array of questions) , make it easier to parse";
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
    
      // Ensure it has the required quiz structure
      if (!parsedData.quiz || !Array.isArray(parsedData.quiz)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid quiz format"));
      }
    

    const newQuiz = new Quiz({
      userId,
      quizData: parsedData.quiz,
    });

    await newQuiz.save();

    return res.status(200).json(
      new ApiResponse(200, { quiz: newQuiz.quizData, userId: userId }, "Quiz saved successfully")
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
    const {
      Input_Msg,
      fileId,
      url,
      userId,
      Token,
      chatId,
      courseId,
      courseworkId,
      attachmentId,
    } = req.body;

    oauth2client.setCredentials(Token);
    const auth = oauth2client;
    let pdfBuffer = null;

    if (courseId && courseworkId) {
      pdfBuffer = await getAttachmentFromClassroom(
        auth,
        courseId,
        courseworkId,
        attachmentId
      );
    } else if (fileId) {
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
    } else if (url) {
      const response = await axios(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      pdfBuffer = await response.arrayBuffer();
    } else {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Either courseId, courseworkId, attachmentId or url is required"
          )
        );
    }

    if (!Input_Msg) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Input_Msg is required"));
    }

    const pdfLocalPath = path.join("public", "temp", "file.pdf");
    fs.writeFileSync(pdfLocalPath, Buffer.from(pdfBuffer), "binary");

    const uploadResult = await uploadToGemini(
      pdfLocalPath,
      req.file?.mimetype || "application/pdf",
      req.file?.originalname || "file.pdf"
    );

    // const genModel = await cacheCreation(uploadResult);
    // const genModelCache = genModel.cachedContent;
    // console.log("GenModel Cache: ",genModelCache);

    let chat = null;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      chat = await Chat.findOne({ user_id: userId });
    }
    const currentUser = await userModel.findById(userId);
    const defaultChat = await Chat.findById(currentUser.chatId);
    if (!chat) {
      chat = await Chat.create({
        user_id: userId,
        context: [
          // {
          //   name: genModelCache.name || "default",
          //   model: genModelCache.model || null,
          //   usageMetadata: genModelCache.usageMetadata || null,
          // },
        ],
        messages: [{ role: "user", content: Input_Msg }],
      });
    } else {
      // chat.context.push({
      //   name: genModelCache.name,
      //   model: genModelCache.model,
      //   usageMetadata: genModelCache.usageMetadata,
      // });
      chat.messages.push({ role: "user", content: Input_Msg });
      await chat.save();
    }
    defaultChat.messages.push({ role: "user", content: Input_Msg });
    await defaultChat.save();
    if (!defaultChat) throw new ApiError(400, "Chat cannot be uploaded");


    if (!chat) throw new ApiError(400, "Chat cannot be uploaded");

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.uri,
          mimeType: uploadResult.mimeType,
        },
      },
      Input_Msg,
    ]);

    // Save the model's response to the chat history
    chat.messages.push({ role: "model", content: result.response.text() });
    await chat.save();

    defaultChat.messages.push({ role: "model", content: result.response.text() });
    await defaultChat.save();

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

    return res.status(200).json(new ApiResponse(200, { "response_text": result.response.text(), "chatId": chat._id }, "Response from the chatbot"));
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
