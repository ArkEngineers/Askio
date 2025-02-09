import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

function FolderCard({ title,date,topicId,courseId }) {
  // const { setModule } = useAuth();

  function stringToSlug(str) {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
  }
  const handleClick = () => {
    // setModule(stringToSlug(title));
  };
  const datetoShow=new Date(date).toLocaleDateString()
  return (
    <div
    key={topicId}
      className="w-40 h-40 min-w-40 cursor-pointer hover:bg-gray-800  transition-all duration-300 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2"
    >
      <div className="w-full h-2/3 ">
        <img
          src="https://st4.depositphotos.com/2572561/31066/i/450/depositphotos_310665768-stock-photo-over-the-shoulder-shot-of.jpg"
          className="h-1/2 w-full object-cover"
        />
        <h3 className="mx-4 mt-2 w-[75%] font-bold text-md text-base-1">
          {title.slice(0,12)+" ..."}
        </h3>
      </div>
      <div>
        <p className="mx-4 text-xs text-grey-1 w-full text-left">{datetoShow}</p>
      </div>
    </div>
  );
}

export default FolderCard;
