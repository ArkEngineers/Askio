import React from "react";

function QuizCard({ title, date }) {
  return (
    <div className="w-60 h-40 min-w-60 hover:bg-gray-800 transition-all duration-300 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2">
      <div className="w-full h-2/3 ">
        <img
          src="https://cdn.corporatefinanceinstitute.com/assets/database-1024x703.jpeg"
          className="h-1/2 w-full object-cover"
        />
        <h3 className="mx-4 mt-2 w-[75%] font-bold text-lg text-base-1">
          {title}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <p className="mx-4 text-xs text-grey-1 w-full text-left">{date}</p>
        <p className="mx-4 text-white text-xs bg-blue-500 px-2 py-1 rounded-2xl text-nowrap cursor-pointer hover:bg-blue-800 transition-all duration-300">
          Take Quiz
        </p>
      </div>
    </div>
  );
}

export default QuizCard;
