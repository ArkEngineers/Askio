import React from "react";
import FolderCard from "../Components/FolderCard";
import { FaBook, FaFolder, FaQuestionCircle } from "react-icons/fa";
import QuizCard from "../Components/QuizCard";
import Slider from "react-slick";
import {
  IoIosArrowDropleft,
  IoIosArrowDropright,
  IoIosArrowForward,
} from "react-icons/io";

const settings = {
  // dots: true,
  // infinite: true,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  nextArrow: <IoIosArrowDropright color="gray" opacity={0.3} />,
  prevArrow: <IoIosArrowDropleft color="gray" opacity={0.3} />,
};

function Home() {
  return (
    <div className="px-20 pl-40 pt-20">
      <h2 className="text-3xl py-10 text-center font-semibold text-base-1">
        Good morning, Azeem Idrisi
      </h2>
      <div className="flex flex-col items-center justify-center pb-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaFolder className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left font-bold">
              Your Folders
            </p>
          </div>
          <div className="flex w-full items-center">
            <Slider {...settings} className="w-full">
              {[
                { title: "Software Engineering", date: "9 Nov" },
                { title: "Artificial Intelligence", date: "18 Oct" },
                { title: "DBMS", date: "29 Oct" },
                { title: "Economics", date: "22 Oct" },
                { title: "GATE Prep", date: "19 Nov" },
                { title: "Machine Learning", date: "5 Dec" },
                { title: "Data Structures", date: "12 Nov" },
                { title: "Operating Systems", date: "17 Nov" },
                { title: "Computer Networks", date: "30 Oct" },
                { title: "Algorithms", date: "24 Nov" },
                { title: "Discrete Mathematics", date: "2 Dec" },
                { title: "Cloud Computing", date: "7 Dec" },
                { title: "Cyber Security", date: "15 Dec" },
                { title: "Human-Computer Interaction", date: "20 Dec" },
              ].map((folder, index) => (
                <FolderCard
                  key={index}
                  title={folder.title}
                  date={folder.date}
                />
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaBook className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left font-semibold">
              Joined Classes
            </p>
          </div>
          <div className="flex w-full items-center">
            <Slider {...{ ...settings, slidesToShow: 4 }} className="w-full">
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
            </Slider>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaQuestionCircle className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left">
              Upcoming Quizzes
            </p>
          </div>
          <div className="flex w-full items-center">
            <Slider {...{ ...settings, slidesToShow: 4 }} className="w-full">
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
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
