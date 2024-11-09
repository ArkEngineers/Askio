import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

function ClassCard({ title, date, faculty }) {
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
    <Link
      to={`/app/${stringToSlug(title)}/notes`}
      onClick={handleClick}
      className="w-60 h-64 min-w-60 hover:bg-gray-800 transition-all duration-300 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2"
    >
      <div className="w-full h-1/2  ">
        <img
          src="https://builtin.com/sites/www.builtin.com/files/2024-10/artificial-intelligence.jpg"
          className="w-full object-cover h-[85%]"
        />
        <h3 className="mx-4 mt-2 w-[75%] font-bold text-lg text-base-1">
          {title}
        </h3>
      </div>
      <div>
        <div className="mx-4 my-4 flex gap-x-2 font-semibold text-sm">
          <FaUserCircle color="white" size={20} />
          <p>{faculty}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="mx-4 text-xs text-grey-1 w-full text-left">{date}</p>
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
