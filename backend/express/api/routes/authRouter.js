import express from "express";
// import authController from "../controllers/auth.controllers";
import authController from "../controllers/auth.controllers.js";
import googleAuth from "../controllers/auth.controllers.js";
import QuizController from "../controllers/quiz.controllers.js";
import ClassController from "../controllers/group.controllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const Router = express.Router();

Router.get("/auth/google", googleAuth);

//group router
Router.post("/group/", ClassController.createClass);
Router.get("/group/groups", ClassController.fetchAllClasses);
Router.put("/class/:groupId/quiz", ClassController.updateQuiz);
Router.put(
  "/class/:groupId/notes",
  ClassController.updateNotes
);
Router.put("/class/:groupId/participants", ClassController.updateParticipants);
Router.get("/group/user/:userEmail/groups", ClassController.fetchUserClasses);

//quiz router
Router.post("/quiz/createQuiz", QuizController.createQuiz);
Router.put("/quiz/updatequiz/:id", QuizController.updateQuiz);
Router.get("/quiz/:id", QuizController.getQuiz);
Router.get("/quiz/", QuizController.getAllQuizzes);
Router.delete("/quiz/del/:id", QuizController.deleteQuiz);
Router.post(
  "/group/:groupId/notes",   // Ensures user is authenticated
  upload.single("pdfFile"),    // Handles PDF file upload
  ClassController.addPDFNoteToGroup
);

export default Router;
