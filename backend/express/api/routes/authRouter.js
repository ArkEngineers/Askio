import express from "express";
// import authController from "../controllers/auth.controllers";
import authController from "../controllers/auth.controllers.js";
import googleAuth from "../controllers/auth.controllers.js";
import QuizController from "../controllers/quiz.controllers.js";
import ClassController from "../controllers/group.controllers.js";

const Router = express.Router();

Router.get("/auth/google", googleAuth);
Router.post("/group/", ClassController.createClass);
Router.get("/group/groups", ClassController.fetchAllClasses);
Router.put("/class/:groupId/quiz", ClassController.updateQuiz);
router.put("/class/:groupId/notes", authMiddleware, ClassController.updateNotes);
Router.put("/class/:groupId/participants", ClassController.updateParticipants);
Router.get("/group/user/:userId/groups", ClassController.fetchUserClasses);
Router.post("/quiz/createQuiz",QuizController.createQuiz);
Router.get("/quiz/:id",QuizController.getQuiz);
Router.get("/quiz/",QuizController.getAllQuizzes);
Router.delete("/quiz/del",QuizController.deleteQuiz);

export default Router;
