import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import QuizCard from "../Components/QuizCard";

import { IoIosRocket } from "react-icons/io";
import axios from "axios";

function Quiz() {
  return (
    <div className="px-10 pl-40 pt-20">
      <h2 className="text-3xl py-10 text-center font-semibold text-base-1">
        Upcoming Quizzes
      </h2>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <IoIosRocket className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left">
              Play quizzes to boost your score
            </p>
          </div>
          <div className="flex w-full items-center flex-wrap gap-y-10">
            {[
              { title: "Maths Unit 1 Quiz", date: "22 Nov" },
              { title: "Physics Chapter 1 Test", date: "25 Nov" },
              { title: "Chemistry Unit 2 Prep", date: "1 Dec" },
              { title: "Biology Chapter 3 Exam", date: "3 Dec" },
              { title: "Computer Science Module 1", date: "5 Dec" },
              { title: "History Unit 4 Quiz", date: "8 Dec" },
            ].map((quiz, index) => (
              <QuizCard key={index} title={quiz.title} date={quiz.date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
