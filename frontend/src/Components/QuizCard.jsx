import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function QuizCard({ title, date }) {
  const { setModule } = useAuth();

  function stringToSlug(str) {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
  }
  const handleClick = () => {
    setModule(stringToSlug(title));
  };

  return (
    <div className="w-60 aspect-square min-w-60 hover:bg-gray-800 transition-all duration-300 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2">
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
        <Link
          to={`/app/play/${stringToSlug(title)}`}
          onClick={handleClick}
          className="mx-4 text-white text-xs bg-blue-500 px-2 py-1 rounded-2xl text-nowrap cursor-pointer hover:bg-blue-800 transition-all duration-300"
        >
          Take Quiz
        </Link>
      </div>
    </div>
  );
}

export default QuizCard;
