import React, { useEffect, useState } from "react";
import CircleQuestion from "./CircleQuestion";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Play() {
  function stringToSlug(str) {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
  }

  const { slugs } = useParams();
  const { quizzes } = useAuth();
  const [seconds, setSeconds] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  // Find the quiz that matches the slug
  const selectedQuiz = quizzes.find(q => stringToSlug(q.PDF_Title) === slugs);

  if (!selectedQuiz) {
    return <h1 className="text-center text-red-500">Quiz not found!</h1>;
  }

  const currentQuestion = selectedQuiz.QA[currentQuestionIndex];

  useEffect(() => {
    let timer;
    if (!showAnswer && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0 || showAnswer) {
      setShowAnswer(true);
    }

    return () => clearInterval(timer);
  }, [seconds, showAnswer]);

  const handleOptionClick = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.QA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSeconds(60);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      alert("Quiz Completed!");
      navigate("/app/puzzle/all");
    }
  };

  return (
    <div className="w-full pt-32 h-screen bg-grey-9 pt-10 flex justify-center items-start">
      <div className="flex justify-around w-7/12 gap-6">
        {/* Questions Sidebar */}
        <div className="bg-grey-7 min-h-72 w-48 rounded-2xl p-5 flex flex-col items-center">
          <p className="font-bold text-center mb-4 text-lg">Questions</p>
          <div className="flex flex-wrap gap-4 mt-4">
            {selectedQuiz.QA.map((_, index) => (
              <CircleQuestion
                key={index}
                number={index + 1}
                current={index === currentQuestionIndex}
              />
            ))}
          </div>
        </div>

        {/* Question and Options */}
        <div className="bg-grey-7 shadow-md min-h-72 flex-1 rounded-2xl p-6">
          <p className="font-bold text-center bg-green-200 w-fit p-4 mx-auto rounded-full py-1">
            Question {currentQuestionIndex + 1}
          </p>
          <div className="mt-6">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <p className="mt-4 font-medium">Select an option:</p>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option} // Use option as the key
                  className={`w-full text-center py-3 rounded-lg text-white font-semibold transition-all 
                    ${selectedOption === option ? "bg-blue-500" : "bg-grey-6 hover:bg-blue-400"}
                    ${showAnswer && option === currentQuestion.answer ? "bg-green-500" : ""}
                    ${showAnswer && selectedOption === option && option !== currentQuestion.answer ? "bg-red-500" : ""}
                  `}
                  onClick={() => handleOptionClick(option)}
                  disabled={showAnswer} // Disable options after submission
                >
                  {option}
                </button>
              ))}

            </div>

            {/* Submit Button */}
            {!showAnswer && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSubmit}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedOption ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                  disabled={!selectedOption}
                >
                  Submit
                </button>
              </div>
            )}

            {/* Show Correct Answer */}
            {showAnswer && (
              <p className="mt-6 text-center font-bold text-green-600">
                Correct Answer: {currentQuestion.answer.toUpperCase()}
              </p>
            )}

            {/* Next Question */}
            {showAnswer && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="bg-grey-7 h-36 w-48 rounded-2xl p-5 flex flex-col items-center justify-center shadow-md">
          <p className="font-bold text-center text-lg mb-2">Time Left</p>
          <h1 className="text-4xl font-bold text-gray-700">
            {seconds > 9 ? `00:${seconds}` : `00:0${seconds}`}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Play;
