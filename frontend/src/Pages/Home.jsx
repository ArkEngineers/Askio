import React from "react";
import FolderCard from "../Components/FolderCard";
import { FaFolder, FaQuestionCircle } from "react-icons/fa";
import QuizCard from "../Components/QuizCard";

function Home() {
  return (
    <div className="px-40">
      <h2 className="text-3xl py-10 text-center font-semibold text-base-1">
        Good morning, Azeem Idrisi
      </h2>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaFolder className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left">Your Folders</p>
          </div>
          <div className="flex w-full items-center">
            <FolderCard title={"Software Engineering"} date={"9 Nov"} />
            <FolderCard title={"Artificial Intelligence"} date={"18 Oct"} />
            <FolderCard title={"DBMS"} date={"29 Oct"} />
            <FolderCard title={"Econimoics"} date={"22 Oct"} />
            <FolderCard title={"GATE Prep"} date={"19 Nov"} />
            <FolderCard title={"GATE Prep"} date={"19 Nov"} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaQuestionCircle className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left">
              Upcoming Quizzes
            </p>
          </div>
          <div className="flex w-full items-center">
            <QuizCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
