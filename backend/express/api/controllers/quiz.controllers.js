import Quiz from "../models/quizModel.js";

// Controller to handle quiz-related actions
const QuizController = {
  // Get a specific quiz by ID
  async getQuiz(req, res) {
    try {
      const quizId = req.params.id;
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  // Update an existing quiz by ID
  async updateQuiz(req, res) {
    try {
      const quizId = req.params.id;
      const { title, question } = req.body;

      // Find and update the quiz
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { title, question },
        { new: true, runValidators: true }
      );

      if (!updatedQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  // Get all quizzes
  async getAllQuizzes(req, res) {
    try {
      const quizzes = await Quiz.find();
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  // Create a new quiz
  async createQuiz(req, res) {
    console.log("HELLO");
    try {
      const { title, question } = req.body;

      // Validate required fields
      if (!title || !question) {
        return res
          .status(400)
          .json({ message: "Title and questions are required" });
      }

      // Create a new quiz document
      const newQuiz = new Quiz({
        title,
        question,
      });

      // Save to the database
      await newQuiz.save();
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  // Delete a quiz by ID
  async deleteQuiz(req, res) {
    try {
      const quizId = req.params.id;
      const quiz = await Quiz.findByIdAndDelete(quizId);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};

export default QuizController;
