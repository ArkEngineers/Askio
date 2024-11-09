import React from "react";

function CircleQuestion({ number, current }) {
  return (
    <div
      className={`h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-300 rounded-full border-2 border-white ${
        current ? "bg-white text-black hover:bg-gray-300" : null
      }`}
    >
      <p className="">{number}</p>
    </div>
  );
}

export default CircleQuestion;
