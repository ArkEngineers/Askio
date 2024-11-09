import express from "express";
import QuizController from "../controllers/quiz.controllers.js";

const quizrouter = express.Router();

quizrouter.get("/getquiz/:id", QuizController.getQuiz);
quizrouter.post("/createquiz", QuizController.createQuiz);

quizrouter.delete("/deletequiz/:id", QuizController.deleteQuiz);

export default quizrouter;
