import React, { useEffect, useState } from "react";
import CircleQuestion from "../Components/CircleQuestion";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Flash() {
  function stringToSlug(str) {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
  }

  const { slugs } = useParams();
  const { flashcard } = useAuth();
  const [seconds, setSeconds] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  // Find the quiz that matches the slug
  const selectedQuiz = flashcard.find(q => stringToSlug(q.PDF_Title) === slugs);
  console.log(selectedQuiz);
  if (!selectedQuiz) {
    return <h1 className="text-center text-red-500">Flashcards not found!</h1>;
  } else {
    return (
      <div className="py-24  grid place-items-center w-full ">
        <h1 className="text-4xl font-bold text-centerpy-6">{selectedQuiz.PDF_Title} Flashcards</h1>
        <div className="grid grid-cols-4 w-10/12 gap-10 place-items-center py-12">
          {selectedQuiz.QA.map(flash => {
            return (
              <Flashcard key={flash.question} flashcard={flash} />
            )
          })}
        </div>
      </div>
    )
  }

}

export default Flash;


function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      onClick={() => setFlip(!flip)}
      className="relative text-white w-full aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-500"
      style={{
        transformStyle: "preserve-3d",
        transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {/* Front side */}
      <div
        className="absolute w-full h-full bg-gray-800 flex items-center text-center px-2 justify-center rounded-xl"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {flashcard.question || flashcard.Q}
      </div>

      {/* Back side */}
      <div
        className="absolute w-full h-full bg-blue-600 flex items-center text-center px-2 justify-center rounded-xl"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)", // Ensure the back side is rotated 180 degrees
        }}
      >
        {flashcard.answer || flashcard.A}
      </div>
    </div>
  );
}