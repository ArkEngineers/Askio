import express from "express";
// import authController from "../controllers/auth.controllers";
import authController from "../controllers/auth.controllers.js";
import googleAuth from "../controllers/auth.controllers.js";
import QuizController from "../controllers/quiz.controllers.js";
import ClassController from "../controllers/group.controllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { updateGroup } from "../controllers/user.controller.js";
import { PdfUrlUpload, RunChat, TalkFromContext, talkToCacheFile, textGeneration } from "../controllers/gemini.controller.js";

const groupRouter = express.Router();
const classRouter = express.Router();
const quizRouter = express.Router();
const authRouter = express.Router();
const geminiRouter = express.Router();


//group router
groupRouter.get("/:groupId",ClassController.fetchByGroupId)
groupRouter.post("/", ClassController.createClass);
groupRouter.get("/groups", ClassController.fetchAllClasses);
groupRouter.post(
  "/:groupId/notes",   // Ensures user is authenticated
  upload.single("pdfFile"),    // Handles PDF file upload
  ClassController.addPDFNoteToGroup
);

// class Router
classRouter.put("/:groupId/quiz", ClassController.updateQuiz);
classRouter.put(
  "/class/:groupId/notes",
  ClassController.updateNotes
);
classRouter.put("/:groupId/participants", ClassController.updateParticipants);

//quiz router
quizRouter.post("/createQuiz", QuizController.createQuiz);
quizRouter.put("/updatequiz/:id", QuizController.updateQuiz);
quizRouter.get("/:id", QuizController.getQuiz);
quizRouter.get("/", QuizController.getAllQuizzes);
quizRouter.delete("/del/:id", QuizController.deleteQuiz);


authRouter.get("/google", googleAuth);
authRouter.get("/:userEmail/groups", ClassController.fetchUserClasses);
authRouter.post("/update_group",updateGroup);

// Gemini Router
geminiRouter.post("/fileChat",upload.single("pdfFile"),RunChat);
geminiRouter.post("/textGenerate",textGeneration);
geminiRouter.post("/talkCache",talkToCacheFile);
geminiRouter.post("/pdfUploadFromUrl",PdfUrlUpload);
geminiRouter.post("/talkwithContext",TalkFromContext);
export {
  authRouter,
  groupRouter,
  classRouter,
  quizRouter,
  geminiRouter
};
